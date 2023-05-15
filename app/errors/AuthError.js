const noTokenProvided = () => {
  return {
    errors: [
      {
        code: "E-005",
        message: "Token tidak disediakan",
      },
    ],
  };
};

const tokenBlocked = () => {
  return {
    errors: [
      {
        code: "E-006",
        message: "Token telah diblokir",
      },
    ],
  };
};

const tokenInvalid = () => {
  return {
    errors: [
      {
        code: "E-007",
        message: "Token tidak valid / diubah secara sengaja",
      },
    ],
  };
};

const tokenNotAuthorized = () => {
  return {
    errors: [
      {
        code: "E-008",
        message: "Token tidak valid untuk user ini",
      },
    ],
  };
};

const unauthorized = () => {
  return {
    errors: [
      {
        code: "E-009",
        message: "Tidak diotorisasi",
      },
    ],
  };
};

const usernameOrPasswordWrong = () => {
  return {
    errors: [
      {
        code: "E-010",
        message: "Username / Password salah",
      },
    ],
  };
};

const oldPasswordIncorrect = () => {
  return {
    errors: [
      {
        code: "E-011",
        message: "Password lama yang anda masukkan salah, silahkan coba lagi",
      },
    ],
  };
};

const alreadyLogin = () => {
  return {
    errors: [
      {
        code: "E-012",
        message: "Anda sudah melakukan login",
      },
    ],
  };
};

const userNotFound = () => {
  return {
    errors: [
      {
        code: "E-013",
        message: "User tidak ditemukan",
      },
    ],
  };
};

const refreshTokenNotFound = () => {
  return {
    errors: [
      {
        code: "E-014",
        message: "Refresh token tidak ditemukan",
      },
    ],
  };
};

module.exports = {
  noTokenProvided,
  tokenBlocked,
  tokenInvalid,
  tokenNotAuthorized,
  unauthorized,
  usernameOrPasswordWrong,
  alreadyLogin,
  userNotFound,
  refreshTokenNotFound,
  oldPasswordIncorrect,
};
