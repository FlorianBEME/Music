const express = require("express");
var cors = require("cors");
const session = require("express-session");
const path = require("path");
const app = express();

app.use(express.static("client/build"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const router = require("./src/routes/index.routes");

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.use("/api", router);
app.use("/", (_, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

module.exports = app;
