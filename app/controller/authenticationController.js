const { User, InvalidToken } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleAuth = async (req, res, next) => {
  try {
    // Using Cookies
    // const accessToken = req.cookies && req.cookies.accessToken ? req.cookies.accessToken : null;
    // if (!accessToken) return res.status(401).send({ message: "Token tidak tersedia" });

    // const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    // const user = await User.findByPk(decoded.id);

    // if (!user) return res.status(401).send({ message: "Unauthorized" });
    // req.user = user;
    // next();

    // Using Authorization
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).send({
        message: "Token tidak disediakan",
      });
    }
    const token = auth.split(" ")[1];

    const invalidToken = await InvalidToken.findOne({ token });
    if (invalidToken) return res.status(403).send({ message: "Token is invalid" });

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findByPk(decodedToken.id);
    if (!user) {
      return res.status(401).send({
        message: "Unauthorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const handleRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek ada body atau tidak
    if (!username || !password) {
      return res.status(400).send({
        message: "Username atau Password harus ada",
      });
    }

    // Cek username sudah ada atau belum
    const exist = await User.findOne({
      where: {
        username: {
          [Op.iLike]: username,
        },
      },
    });
    if (exist) {
      return res.status(400).send({
        message: "Username telah digunakan",
      });
    }

    // Enkripsi password
    const newPassword = await bcrypt.hash(password, 10);

    // Buat user
    await User.create({
      username,
      password: newPassword,
    });

    res.status(201).send({
      message: "User berhasil dibuat",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: error.message,
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek ada body atau tidak
    if (!username || !password) {
      return res.status(400).send({
        message: "Username atau Password harus ada",
      });
    }

    // Cek user ada atau tidak
    const user = await User.findOne({
      where: {
        username: {
          [Op.iLike]: username,
        },
      },
    });
    if (!user) {
      return res.status(404).send({
        message: "Username atau password salah",
      });
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).send({
        message: "Username atau password salah",
      });
    }

    const accessToken = generateAccessToken(user);
    let refreshToken;
    if (user.refreshToken == null) {
      refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET);
      await user.update({ refreshToken });
    }

    // res.cookie("accessToken", accessToken, { httpOnly: true });
    // res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.status(200).send({
      accessToken,
      // refreshToken,
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: error.message,
    });
  }
};

const handleLogout = async (req, res) => {
  try {
    const { username, token } = req.body;

    if (!username || !token) return res.status(400).send({ message: "Username atau Token harus ada" });

    const user = await User.findOne({
      where: {
        username: {
          [Op.iLike]: username,
        },
      },
    });

    if (!user)
      return res.status(404).send({
        message: "User tidak ditemukan",
      });

    await user.update({
      refreshToken: null,
    });

    await InvalidToken.create({
      token,
    });

    await res.status(200).send({
      message: "Berhasil logout",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const handleWhoAmI = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.status(200).send({
      message: "User berhasil diambil",
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);

    // Cek user ada atau tidak
    const user = await User.findOne({
      where: {
        refreshToken,
      },
    });

    if (!user) return res.sendStatus(403);

    jwt.verify(user.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken(data);
      res.status(200).send({ accessToken });
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
};

module.exports = { handleRegister, handleLogin, handleAuth, handleWhoAmI, handleRefreshToken, handleLogout };
