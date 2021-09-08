const express = require("express");
const routes = express.Router();
const users = require("./users");
const cities = require("./cities");
const schedule = require("./schedule");

routes.get("/", (req, res) => {
  return res.render("index");
});

routes.use(users);
routes.use(cities);
routes.use(schedule);

module.exports = routes;
