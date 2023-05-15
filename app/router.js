const express = require("express");
const router = express.Router();
const { authenticationController, userController } = require("./controller");
const bodyValidation = require("./validation/bodyValidation");
const validationResult = require("./validation/validationResult");
const swaggerDocument = require("../docs/openapi.json");
const swaggerUI = require("swagger-ui-express");

router.get("/", (req, res) => {
  res.send({
    message: "Halaman home",
  });
});

// API Docs Swagger
router.use("/api-docs/json", (req, res) => {
  res.json(swaggerDocument);
});
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// User
router.post("/register", bodyValidation.authValidate, validationResult.validate, authenticationController.handleRegister);
router.post("/login", bodyValidation.authValidate, validationResult.validate, authenticationController.handleLogin);
router.get("/me", authenticationController.handleAuth, authenticationController.handleWhoAmI);
router.post("/refresh", authenticationController.handleRefreshToken);
router.post("/logout", bodyValidation.logoutValidate, validationResult.validate, authenticationController.handleLogout);
router.patch("/updateUsername", authenticationController.handleAuth, bodyValidation.updateUsernameValidate, validationResult.validate, userController.handleUpdateUsername);
router.patch("/updatePassword", authenticationController.handleAuth, bodyValidation.updatePasswordValidate, validationResult.validate, userController.handleUpdatePassword);

module.exports = router;
