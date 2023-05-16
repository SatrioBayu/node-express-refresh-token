const internalError = (error) => {
  return {
    errors: [
      {
        code: "E-018",
        message: error,
      },
    ],
  };
};

module.exports = { internalError };
