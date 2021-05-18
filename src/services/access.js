const isAdmin = () => {
  const userType = JSON.parse(localStorage.getItem('SistemaUser'));
  return userType.type;
};

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('SistemaUser'));
  return user.uid;
};

const setUser = (user) => {
  localStorage.setItem('SistemaUser', JSON.stringify(user));
};

module.exports = {
  isAdmin,
  getUserId,
  setUser,
};
