const usernameAlreadyRegistered = () => {
  return {
    errors: [
      {
        code: "E-014",
        message: "Username telah digunakan",
      },
    ],
  };
};

module.exports = { usernameAlreadyRegistered };
