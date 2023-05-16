const authErr = require("./AuthError");
const internalErr = require("./InternalServerError");
const usernameErr = require("./UsernameError");
const uploadErr = require("./UploadError");

module.exports = { authErr, internalErr, usernameErr, uploadErr };
