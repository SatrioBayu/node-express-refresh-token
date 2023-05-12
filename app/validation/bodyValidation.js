const { body } = require("express-validator");

const usernameValidator = body("username").notEmpty().withMessage({
  code: "E-001",
  message: "Username tidak boleh kosong",
});

module.exports = {
  authValidate: [
    usernameValidator,
    body("password").notEmpty().withMessage({
      code: "E-002",
      message: "Password tidak boleh kosong",
    }),
  ],
  logoutValidate: [
    usernameValidator,
    body("token").notEmpty().withMessage({
      code: "E-003",
      message: "Token tidak boleh kosong",
    }),
  ],
};
