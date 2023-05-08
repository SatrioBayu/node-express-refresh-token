const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).send({
        message: "No token provided",
      });
    }
    const token = auth.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
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
        username,
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
        username,
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).send({
      token,
    });
  } catch (error) {
    console.log(error.message);
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

module.exports = { handleRegister, handleLogin, handleAuth, handleWhoAmI };
