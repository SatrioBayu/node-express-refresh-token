const { User, InvalidToken } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { authErr, internalErr, usernameErr, uploadErr } = require("../errors");
const cloudinary = require("../middleware/cloudinary");

const handleUpdateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send(authErr.userNotFound());
    if (username === user.username) return res.status(400).send(usernameErr.newUsernameSame());

    const existingUser = await User.findOne({
      where: {
        username: {
          [Op.iLike]: username,
        },
      },
    });

    if (existingUser && existingUser.id !== user.id) return res.status(409).send(usernameErr.usernameAlreadyRegistered());

    await user.update({
      username,
    });

    res.status(200).send({
      message: "Username berhasil diubah",
    });
  } catch (error) {
    res.status(500).send(internalErr.internalError(error.message));
  }
};

const handleUpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).send(authErr.userNotFound());

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) return res.status(401).send(authErr.oldPasswordIncorrect());

    const newHasedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: newHasedPassword,
    });
    res.status(200).send({
      message: "Password berhasil diubah",
    });
  } catch (error) {
    res.status(500).send(internalErr.internalError(error.message));
  }
};

const handleUpdateImage = async (req, res) => {
  try {
    const { id } = req.user;

    if (!req.file) return res.status(400).send(uploadErr.noFileUploaded());

    const user = await User.findByPk(id);
    if (!user) return res.status(404).send(authErr.userNotFound());

    if (user.photo_profile && user.photo_public_id) {
      await cloudinary.uploader.destroy(user.photo_public_id);
    }

    const result = await uploadImageToCloudinary(req, {
      folder: "photo_profile",
    });

    await user.update({
      photo_profile: result.secure_url,
      photo_public_id: result.public_id,
    });

    res.status(200).send({
      message: "File berhasil diupload dan diperbarui",
      result,
    });
  } catch (error) {
    res.status(500).send(internalErr.internalError(error.message));
  }
};

const uploadImageToCloudinary = async (req, options = {}) => {
  try {
    const fileBase64 = req.file.buffer.toString("base64");
    const file = `data:${req.file.mimetype};base64,${fileBase64}`;
    const result = await cloudinary.uploader.upload(file, options);
    return result;
  } catch (error) {
    throw {
      code: "E-022",
      message: error.message,
    };
  }
};
module.exports = {
  handleUpdateUsername,
  handleUpdatePassword,
  handleUpdateImage,
};
