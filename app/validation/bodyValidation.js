const { body } = require("express-validator");

const usernameValidator = body("username").notEmpty().withMessage({
  code: "E-001",
  message: "Username tidak boleh kosong",
});

const passwordValidator = (fieldName) => {
  return body(fieldName).custom((value) => {
    if (value.length < 6) {
      throw {
        code: "E-002",
        message: "Password minimal 6 karakter",
      };
    }
    if (!/[a-zA-Z]/.test(value)) {
      throw {
        code: "E-003",
        message: "Password harus setidaknya terdiri dari 1 huruf",
      };
    }
    if (!/\d/.test(value)) {
      throw {
        code: "E-004",
        message: "Password harus setidaknya terdiri dari 1 angka",
      };
    }
    if (!/[A-Z]/.test(value)) {
      throw {
        code: "E-005",
        message: "Password harus setidaknya terdiri dari 1 huruf kapital",
      };
    }
    if (!/[\W_]/.test(value)) {
      throw {
        code: "E-006",
        message: "Password harus setidaknya terdiri dari 1 karakter spesial",
      };
    }
    return true;
  });
};

// const passwordValidator = body("password")
//   .notEmpty()
//   .withMessage({
//     code: "E-002",
//     message: "Password tidak boleh kosong",
//   })
//   .isLength({ min: 6 })
//   .withMessage({
//     code: "E-003",
//     message: "Password minimal 6 karakter",
//   })
//   .matches(/[a-zA-Z]/)
//   .withMessage({
//     code: "E-004",
//     message: "Password harus setidaknya terdiri dari 1 huruf",
//   })
//   .matches(/\d/)
//   .withMessage({
//     code: "E-005",
//     message: "Password harus setidaknya terdiri dari 1 angka",
//   })
//   .matches(/[A-Z]/)
//   .withMessage({
//     code: "E-006",
//     message: "Password harus setidaknya terdiri dari 1 huruf kapital",
//   })
//   .matches(/[\W_]/)
//   .withMessage({
//     code: "E-007",
//     message: "Password harus setidaknya terdiri dari 1 karakter khusus",
//   });

module.exports = {
  authValidate: [usernameValidator, passwordValidator("password")],
  loginValidate: [
    usernameValidator,
    body("password").notEmpty().withMessage({
      code: "E-002",
      message: "Password tidak boleh kosong",
    }),
  ],
  updateUsernameValidate: [usernameValidator],
  updatePasswordValidate: [passwordValidator("oldPassword"), passwordValidator("newPassword")],
  logoutValidate: [
    usernameValidator,
    body("token").notEmpty().withMessage({
      code: "E-007",
      message: "Token tidak boleh kosong",
    }),
  ],
};
