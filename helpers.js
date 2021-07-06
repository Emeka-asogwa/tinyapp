
const getUserByEmail = function (userEmail, users) {
  for (let id in users) {
    if (users[id].email === userEmail) {
      return users[id];
    }
  }
  return null;
};

const getDate = function(){
  let date = new Date();
  const dd = String(date.getDate()).padStart(2,'0');
  const mm = String(date.getMonth() + 1).padStart(2,'0');
  const yyyy = date.getFullYear();
  date = mm +'/' + dd + '/' + yyyy;
  return date;
};

//To return a random string of length 10
const generateRandomString = function() {
  const possibleCombination = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('');
  let string = "";
  for (let i = 0; i < 6; i++) {
    string += possibleCombination[Math.floor(Math.random() * possibleCombination.length)];
  }
  return string;
};

// Selecting urls by the user id


module.exports = { getUserByEmail, getDate, generateRandomString };