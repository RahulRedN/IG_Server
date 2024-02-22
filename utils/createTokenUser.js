const createTokenUser = (user) => {
  return { name: user.name, uid: user._id, role: user.role };
};

module.exports = createTokenUser;
