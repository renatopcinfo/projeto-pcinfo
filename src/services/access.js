const isAdmin = () => {
  const userType = JSON.parse(localStorage.getItem('userInfo'));
  return userType.type;
};

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user.uid;
};

const setUser = (user) => {
  localStorage.setItem('userInfo', JSON.stringify(user));
};

module.exports = {
  isAdmin,
  getUserId,
  setUser,
};
