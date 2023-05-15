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
    body("password").isLength(6).withMessage({
      code: "E-003",
      message: "Password minimal 6 karakter",
    }),
  ],
  updateUsernameValidate: [usernameValidator],
  updatePasswordValidate: [
    body("oldPassword").notEmpty().withMessage({
      code: "E-002",
      message: "Password lama tidak boleh kosong",
    }),
    body("oldPassword").isLength(6).withMessage({
      code: "E-003",
      message: "Password lama minimal 6 karakter",
    }),
    body("newPassword").notEmpty().withMessage({
      code: "E-002",
      message: "Password baru tidak boleh kosong",
    }),
    body("newPassword").isLength(6).withMessage({
      code: "E-003",
      message: "Password baru minimal 6 karakter",
    }),
  ],
  logoutValidate: [
    usernameValidator,
    body("token").notEmpty().withMessage({
      code: "E-004",
      message: "Token tidak boleh kosong",
    }),
  ],
};
