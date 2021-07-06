
const getUserByEmail = function (userEmail, users) {
  for (let id in users) {
    if (users[id].email === userEmail) {
      return users[id];
    }
  }
  return null;
};

module.exports = { getUserByEmail };