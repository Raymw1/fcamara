const express = require("express");
const routes = express.Router();

routes.get("/", (req, res) => {
  return res.render("login");
});

routes.get("/signup", (req, res) => {
  return res.render("signup");
});

routes.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = routes;
