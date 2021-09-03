const express = require("express");
const server = express();
const routes = require("./routes/index");
const nunjucks = require("nunjucks");
const path = require("path");

server.set("view engine", "html");
nunjucks.configure(path.join(__dirname, "app/views"), {
  express: server,
  autoescape: false,
  noCache: true,
});
server.use(routes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`Server running in http://127.0.0.1:${PORT}`);
});
