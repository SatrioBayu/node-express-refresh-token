const { User, InvalidToken } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { noTokenProvided, tokenBlocked, tokenInvalid, unauthorized, usernameOrPasswordWrong, alreadyLogin, userNotFound, tokenNotAuthorized, refreshTokenNotFound } = require("../errors/AuthError");
const { internalError } = require("../errors/InternalServerError");
const { usernameAlreadyRegistered } = require("../errors/UsernameError");
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
      return res.status(401).send(noTokenProvided());
    }
    const token = auth.split(" ")[1];

    const invalidToken = await InvalidToken.findOne({
      where: {
        token,
      },
    });
    if (invalidToken) return res.status(403).send(tokenBlocked());

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.send(tokenInvalid());

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).send(unauthorized());
      }
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).send(internalError(error.message));
  }
};

const handleRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek username sudah ada atau belum
    const exist = await User.findOne({
      where: {
        username: {
          [Op.iLike]: username,
        },
      },
    });
    if (exist) {
      return res.status(400).send(usernameAlreadyRegistered());
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
    res.status(500).send(internalError(error.message));
  }
};

const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek user ada atau tidak
    const user = await User.findOne({
      where: {
        username: {
          [Op.iLike]: username,
        },
      },
    });
    if (!user) return res.status(404).send(usernameOrPasswordWrong());

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(404).send(usernameOrPasswordWrong());

    const refreshTokenCookie = req.cookies.refreshToken;
    if (refreshTokenCookie) return res.status(409).send(alreadyLogin());

    const accessToken = generateAccessToken(user);

    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 1000,
    });

    // let refreshToken;
    // if (user.refreshToken == null) {
    //   refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET);
    //   await user.update({ refreshToken });
    // }

    // res.cookie("accessToken", accessToken, { httpOnly: true });
    // res.cookie("refreshToken", refreshToken, { httpOnly: true });

    res.status(200).send({
      accessToken,
      // refreshToken,
    });
  } catch (error) {
    res.status(500).send(internalError(error.message));
  }
};

const handleLogout = async (req, res) => {
  try {
    const { username, token } = req.body;

    // if (!username || !token) return res.status(400).send({ message: "Username atau Token harus ada" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.send(tokenInvalid());
      const userId = decoded.id;

      const user = await User.findByPk(userId);

      if (!user) return res.status(404).send(userNotFound());

      if (user.username !== username) return res.status(401).send(tokenNotAuthorized());

      // await user.update({
      //   refreshToken: null,
      // });

      const tokenExist = await InvalidToken.findOne({
        where: {
          token,
        },
      });

      if (!tokenExist) {
        await InvalidToken.create({
          token,
        });
      }

      await res.status(200).send({
        message: "Berhasil logout",
      });
    });
  } catch (error) {
    res.status(500).send(internalError(error.message));
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
    res.status(500).send(internalError(error.message));
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken == null) return res.status(401).send(refreshTokenNotFound());

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.send(tokenInvalid());

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).send(userNotFound());
      }

      const accessToken = generateAccessToken(user);
      res.status(200).send({
        accessToken,
      });
    });
  } catch (error) {
    res.status(500).send(internalError(error.message));
  }
};

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
};

module.exports = { handleRegister, handleLogin, handleAuth, handleWhoAmI, handleRefreshToken, handleLogout };
