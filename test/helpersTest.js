const { assert } = require('chai');
const getUsersByEmail = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "users2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUsersByEmail', function() {
  it('Should return a user with valid email', function() {
    const user = getUsersByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });
  it('Should return undefined when an email is not in the database', function() {
    const user = getUsersByEmail("user3@example.com", testUsers);
    const expectedUserID = undefined;
    assert.equal(user, expectedUserID);
  });
});
