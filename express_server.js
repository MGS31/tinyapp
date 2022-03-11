const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({extended: true}));

// app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ["sadhaskjd"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.set("view engine", "ejs");

// global functions and objects:
const generateRandomString = function(max) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for ( let i = 0; i < max; i++ ) {
    randomString += characters.charAt(Math.floor(Math.random()*characters.length));
 }
 return randomString;
}

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJ48lW"
  },
  "9sm5xK": { 
    longURL: "http://www.google.com",
    userID: "aJ48lW"
  }
};

const checkEmail = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
 };

const users = {
  userID: {
    id: "userID",
    email: "user@example.com",
    password: "userpassword"
  }
};

const getUserByEmail = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
};

const urlsForUser = function(id) {
  let userURLS = {}
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLS[url] = urlDatabase[url];
    }
  }
  return userURLS;
};


// get requests:
app.get("/register", (req, res) => {
  const templateVars = { 
    user : users[req.session.user_id],
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { 
    user : users[req.session.user_id],
  };
  res.render("url_login", templateVars);
});

app.get("/urls", (req, res) => {
  const userURL = urlsForUser(req.session.user_id);
    const templateVars = {  
      urls : userURL,
      user : users[req.session.user_id],
    };
    res.render("urls_index", templateVars)
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user : users[req.session.user_id]
  };
  if (req.session.user_id) {
    console.log("Here!");
    res.render("urls_new", templateVars);
  } else {
  res.render("url_login", templateVars);
  };
});

app.get("/urls/:shortURL", (req, res) => {
  const userURL = urlsForUser(req.session.user_id);
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { 
    shortURL: shortURL, 
    longURL: longURL,
    user : users[req.session.user_id],
  };
  if (!req.session.user_id) {
    res.status(400).send("Unauthorised Request");
  };
  if (req.session.user_id === userURL[shortURL].userID) {
    res.render("urls_show", templateVars);
  } else {
    console.log("Test: ", urlsForUser(req.session.user_id));
    res.status(400).send("Unauthorised Request");
  };
});

app.get ("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  if (req.session.user_id) {
  res.redirect(`/urls/${shortURL}`);
  } else {
  return res.status(400).send("Unauthorised Request");
};
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  if (!shortURL) {
    return res.status(400).send("Unauthorised Request");
  } else {
    res.redirect(longURL);
  };
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// post requests:
app.post("/register", (req, res) => {
  const id = generateRandomString(6);
  const email = req.body["email"].trim();
  const password = req.body["password"].trim();
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email !== '' && password !== '') {
    if (!checkEmail(email, users)) {
      users[id] = { id, email, password : hashedPassword };
      req.session.user_id = id;
      res.redirect(`/urls`);
    } else {
      return res.status(400).send("Invalid Credentials!");
    };
  } else {
    return res.status(400).send("Invalid Credentials!");
  };
});

app.post("/login", (req, res) => {  
  const inputEmail = req.body.email;
  const inputPass = req.body.password;
  if (!inputEmail || !inputPass) {
    return res.status(403).send("Invalid Credentials!")
  };
  const userID = getUserByEmail(inputEmail);
  const password = userID.password;
  if (!userID) {
    return res.status(403).send("Invalid Credentials!");
  };
  if (!bcrypt.compareSync(inputPass, password)) {
    return res.status(403).send("Invalid Credentials!");
  };
  const user_id = userID.id;
  req.session.user_id = user_id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {  
  // set session to null
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  if (req.session.user_id) {
  const shortURL = generateRandomString(6);
  const longURL = req.body["longURL"];
  const userID = req.session.user_id;
  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
  } else {
    return res.status(400).send("Unauthorised Request");
  };
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body["longURL"];
  if (req.session.user_id) {
  urlDatabase[shortURL].longURL = longURL;
  } else {
    return res.status(400).send("Unauthorised Request");
  };
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id) {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
} else {
  return res.status(400).send("Unauthorised Request");
};
});

// port listening confirmation

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});