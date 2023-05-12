const internalError = (error) => {
  return {
    errors: [
      {
        code: "E-013",
        message: error,
      },
    ],
  };
};

module.exports = { internalError };
