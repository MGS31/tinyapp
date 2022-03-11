const users = {
  userID: {
    id: "userID",
    email: "user@example.com",
    password: "userpassword"
  }
};

// const checkEmail = function(email) {
//   for (const emails in users) {
//     console.log(users);
//     console.log(emails);
//     if (users[emails].email === email) {
//       console.log(users);
//       return true;
//     }
//   }
//   return false;
//  };

 const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (users[user].email === email) {
      return users[user].id;
    }
  }
};

console.log(getUserByEmail("user@example.com"));

// const urlDatabase = {
//   "b2xVn2": {
//     longURL: "http://www.lighthouselabs.ca",
//     userID: "aJ48lW"
//   },
//   "9sm5xK": { 
//     longURL: "http://www.google.com",
//     userID: "aJ48lW"
//   }
// };

// const urlsForUser = function(id) {
//   let userURLS = {}
//   for (const url in urlDatabase) {
//     if (urlDatabase[url].userID === id) {
//       userURLS[url] = urlDatabase[url];
//     }
//   }
//   return userURLS;
// };

// // console.log(urlsForUser("aJ48lW"));
// const userId = "aJ48lW";
// const userURL = urlsForUser(userId)

// console.log(userURL);