const internalError = (error) => {
  return {
    errors: [
      {
        code: "E-015",
        message: error,
      },
    ],
  };
};

module.exports = { internalError };
