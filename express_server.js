const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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


// get requests:
app.get("/register", (req, res) => {
  const templateVars = { 
    user : users[req.cookies["user_id"]],
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = { 
    user : users[req.cookies["user_id"]],
  };
  res.render("url_login", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls : urlDatabase,
    user : users[req.cookies["user_id"]],
  };
  console.log(users);
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user : users[req.cookies["user_id"]],
  };
  if (req.cookies["user_id"]) {
    res.render("urls_new", templateVars);
  } else {
  res.render("url_login", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user : users[req.cookies["user_id"]],
  }
  res.render("urls_show", templateVars);
});

app.get ("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// post requests:
app.post("/register", (req, res) => {
  const id = generateRandomString(6);
  const email = req.body["email"].trim();
  const password = req.body["password"].trim();
  if (email !== '' && password !== '') {
    if (!checkEmail(email, users)) {
      users[id] = { id, email, password };
      res.cookie("user_ID", id);
      res.redirect(`/urls`);
    } else {
      return res.status(400).send("Invalid Credentials!");
    }
  } else {
    return res.status(400).send("Invalid Credentials!");
  }
});

app.post("/login", (req, res) => {  
  const inputEmail = req.body.email;
  const inputPass = req.body.password;

  if (!inputEmail || !inputPass) {
    res.statusCode = 403;
    res.send("Invalid Credentials")
  }
  const user = getUserByEmail(inputEmail);
  if (!user) {
    res.statusCode = 403;
    res.send("Invalid Credentials");
  }
  if (user.password !== inputPass) {
    res.statusCode = 403;
    res.send("Email or password incorrect please try again");
  }
  const user_id = user.id;
  res.cookie("user_id", user_id);
  res.redirect("/urls");

});

app.post("/logout", (req, res) => {  
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  if (req.cookies["user_id"]) {
  const shortURL = generateRandomString(6);
  const longURL = req.body["longURL"];
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
  } else {
    return res.status(400).send("Unauthorised Request");
  }
});

app.post("/urls/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = req.body["longURL"];
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls")
})

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// port listening confirmation

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});