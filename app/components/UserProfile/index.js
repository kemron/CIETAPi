const User = require('./UserDbModel')
const crypto = require('crypto')
const DuplicateUserError = require('./DuplicateUserError')
const UserProfileReadModel = require('./UserProfileReadModel')
module.exports = {
  registerNewUser,
  getUserWithCredential,
  getUserById
}

async function registerNewUser(firstname, lastname, email, password) {

  let existing = await User.findOne({ email })
  if (existing !== null) {
    throw new DuplicateUserError()
  }

  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .update(email)
    .digest("hex");

  return User.create({
    firstname,
    lastname,
    email,
    password: passwordHash
  });
}


async function getUserWithCredential(email, password) {
  const passwordHash = crypto
    .createHash("sha256")
    .update(password)
    .update(email)
    .digest("hex");

  return new UserProfileReadModel(await User.findOne({
    email,
    password: passwordHash
  }));
}

async function getUserById(userId) {
  return new UserProfileReadModel(await User.findById(userId));
}
