const bcrypt = require("bcrypt");

// Pre-hash password "password123" for demo
const hashedPassword = bcrypt.hashSync("password123", 10);

const users = [
  {
    _id: "1",
    username: "david",
    password: hashedPassword,
    failedLoginAttempts: 0,
    lockUntil: null
  }
];

async function findOne(query) {
  return users.find(u => u.username === query.username) || null;
}

async function save(user) {
  return user; // In-memory, nothing stored
}

class User {
  constructor(data) {
    Object.assign(this, data);
  }
}

User.findOne = findOne;
User.prototype.save = save;

module.exports = User;
