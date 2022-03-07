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

// get requests:
app.get("/register", (req, res) => {
  const templateVars = { 
    username : req.cookies['username']
  };
  res.render("urls_register", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls : urlDatabase,
    username : req.cookies['username']
  };
  res.render("urls_index", templateVars)
})

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    username : req.cookies['username']
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username : req.cookies['username']}
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
app.post("/login", (req, res) => {  
  const username = req.body["username"];
  res.cookie('username', username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {  
  const username = req.body["username"];
  res.clearCookie('username', username);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  const longURL = req.body["longURL"];
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
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