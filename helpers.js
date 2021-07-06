
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

module.exports = { getUserByEmail, getDate };