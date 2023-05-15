const usernameAlreadyRegistered = () => {
  return {
    errors: [
      {
        code: "E-016",
        message: "Username telah digunakan",
      },
    ],
  };
};

module.exports = { usernameAlreadyRegistered };
