const usernameAlreadyRegistered = () => {
  return {
    errors: [
      {
        code: "E-019",
        message: "Username telah digunakan",
      },
    ],
  };
};

const newUsernameSame = () => {
  return {
    errors: [
      {
        code: "E-020",
        message: "Username baru tidak boleh sama dengan username sebelumnya",
      },
    ],
  };
};

module.exports = { usernameAlreadyRegistered, newUsernameSame };
