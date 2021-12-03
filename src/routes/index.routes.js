const router = require("express").Router();
const users = require("./users.routes.js");
const events = require("./events.routes.js");
const login = require("./login.routes.js");
const upload = require("./upload.routes.js");
const commonjson = require("./app.routes");
const visitor = require("./visitor.routes.js");
const currentsongs = require("./currentsongs.routes.js");
const pop = require("./pop.routes.js");
const footer = require("./footeritem.routes.js");
const footerCopyright = require("./footercopyright.routes");
const eventpicture = require("./picturesevent.routes");

router.use("/login", login);
router.use("/users", users);
router.use("/currentsongs", currentsongs);
router.use("/events", events);
router.use("/upload", upload);
router.use("/app", commonjson);
router.use("/visitor", visitor);
router.use("/pop", pop);
router.use("/footer", footer);
router.use("/copyright", footerCopyright);
router.use("/eventpicture", eventpicture);

module.exports = router;
