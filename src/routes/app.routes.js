const fs = require("fs");
const jsonPath = `${__dirname}/../json/appcommon.json`;

const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth");

router.get("/app", (req, res) => {
  fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      let response = null;
      new Promise((resolve) => {
        response = JSON.parse(data);
        if (response) {
          resolve();
        }
      })
        .then(() => {
          res.status(200).json(response[0]);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
  });
});

router.put("/songinprogress/:id", verifyJWT, (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      let obj = null;
      new Promise((resolve) => {
        obj = JSON.parse(data);
        if (obj) {
          resolve();
        }
      }).then(() => {
        new Promise((resolve) => {
          obj[id].app.titleincurent = req.body.titleincurent;
          resolve();
        }).then(() => {
          const newData = JSON.stringify(obj);
          fs.writeFile(jsonPath, newData, "utf8", function () {
            res.status(200).json(newData[id]);
          });
        });
      });
    }
  });
});

router.put("/titleEventappStyle/position/:id", verifyJWT, (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      let obj = null;
      new Promise((resolve) => {
        obj = JSON.parse(data);
        if (obj) {
          resolve();
        }
      }).then(() => {
        new Promise((resolve) => {
          obj[id].titleEventappStyle.position = req.body.position;
          resolve();
        }).then(() => {
          const newData = JSON.stringify(obj);
          fs.writeFile(jsonPath, newData, "utf8", function () {
            res.status(200).json(JSON.parse(newData)[0]);
          });
        });
      });
    }
  });
});

router.put("/titleEventappStyle/color/:id", verifyJWT, (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      let obj = null;
      new Promise((resolve) => {
        obj = JSON.parse(data);
        if (obj) {
          resolve();
        }
      }).then(() => {
        new Promise((resolve) => {
          obj[id].titleEventappStyle.color = req.body.color;
          resolve();
        }).then(() => {
          const newData = JSON.stringify(obj);
          fs.writeFile(jsonPath, newData, "utf8", function () {
            res.status(200).json(JSON.parse(newData)[0]);
          });
        });
      });
    }
  });
});

router.put("/titleEventappStyle/display/:id", verifyJWT, (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      let obj = null;
      new Promise((resolve) => {
        obj = JSON.parse(data);
        if (obj) {
          resolve();
        }
      }).then(() => {
        new Promise((resolve) => {
          obj[id].titleEventappStyle.display = req.body.display;
          resolve();
        }).then(() => {
          const newData = JSON.stringify(obj);
          fs.writeFile(jsonPath, newData, "utf8", function () {
            res.status(200).json(JSON.parse(newData)[0]);
          });
        });
      });
    }
  });
});

router.put("/app/defaultpictureaccept/:id", verifyJWT, (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      let obj = null;
      new Promise((resolve) => {
        obj = JSON.parse(data);
        if (obj) {
          resolve();
        }
      }).then(() => {
        new Promise((resolve) => {
          obj[id].app.defaultPictureAccept = req.body.defaultPictureAccept;
          resolve();
        }).then(() => {
          const newData = JSON.stringify(obj);
          fs.writeFile(jsonPath, newData, "utf8", function () {
            const result = JSON.parse(newData);
            res.status(200).json(result[id]);
          });
        });
      });
    }
  });
});

router.put("/textbanner/:id", verifyJWT, (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      let obj = null;
      new Promise((resolve) => {
        obj = JSON.parse(data);
        if (obj) {
          resolve();
        }
      }).then(() => {
        new Promise((resolve) => {
          obj[id].app.textbanner = req.body.data;
          resolve();
        }).then(() => {
          const newData = JSON.stringify(obj);
          fs.writeFile(jsonPath, newData, "utf8", function () {
            res.status(200).json(JSON.parse(newData)[0].app.textbanner);
          });
        });
      });
    }
  });
});

module.exports = router;
