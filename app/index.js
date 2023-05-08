const express = require("express");
const cors = require("cors");
const router = require("./router");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

module.exports = app;
