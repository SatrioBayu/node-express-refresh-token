const express = require("express");
const router = express.Router();
const { authenticationController } = require("./controller");
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
router.post("/register", authenticationController.handleRegister);
router.post("/login", authenticationController.handleLogin);
router.get("/me", authenticationController.handleAuth, authenticationController.handleWhoAmI);
router.post("/refresh", authenticationController.handleRefreshToken);
router.post("/logout", authenticationController.handleLogout);

module.exports = router;
