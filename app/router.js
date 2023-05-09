const express = require("express");
const router = express.Router();
const { authenticationController } = require("./controller");

router.get("/", (req, res) => {
  res.send({
    message: "Halaman home",
  });
});

// User
router.post("/register", authenticationController.handleRegister);
router.post("/login", authenticationController.handleLogin);
router.get("/me", authenticationController.handleAuth, authenticationController.handleWhoAmI);
router.post("/refresh", authenticationController.handleRefreshToken);

module.exports = router;
