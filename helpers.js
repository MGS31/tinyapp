/**
 * Pulls user ID of logged in user by their email.
 * @param {string} email
 * @param {object} database
 * @returns {string} user ID.
 */
const getUserByEmail = function(email, database) {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
};

/**
 * Generates random string as user id.
 * @param {integer} max
 * @returns {string} randomString
 */
const generateRandomString = function(max) {
  let randomString = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < max; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

/**
 * Checks to see if the User's Email is already registered.
 * @param {string} email;
 * @param {object} users
 * @returns {boolean} true or false
 */
const checkEmail = function(email, users) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }
  return false;
};

/**
 * returns a new object of only the urls created by the currently signed in user.
 * @param {string} id;
 * @param {object} urlDatabase
 * @returns {object} containing users urls.
 */
const urlsForUser = function(id, urlDatabase) {
  let userURLS = {};

  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURLS[url] = urlDatabase[url];
    }
  }
  return userURLS;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  checkEmail,
  urlsForUser
};