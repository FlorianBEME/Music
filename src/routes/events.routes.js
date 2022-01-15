const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth");
const fs = require("fs");
const jsonPath = `${__dirname}/../json/appcommon.json`;

router.get("/", (req, res) => {
  const sql = "SELECT * FROM events";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/", verifyJWT, (req, res) => {
  const sql = "INSERT INTO events SET ?";
  connection.query(sql, req.body, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  });
});

router.put("/:id", verifyJWT, (req, res) => {
  let sql = "UPDATE events SET ? WHERE id=?";
  connection.query(sql, [req.body, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      sql = "SELECT * FROM events WHERE id=?";
      connection.query(sql, req.params.id, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            errorMessage: `Event with id ${req.params.id} not found`,
          });
        } else {
          res.status(200).json(result[0]);
        }
      });
    }
  });
});

router.delete("/remove/all", verifyJWT, (req, res) => {
  const sql =
    "TRUNCATE TABLE events; SET FOREIGN_KEY_CHECKS = 0; TRUNCATE TABLE visitor; TRUNCATE TABLE currentsongs; TRUNCATE TABLE popup; SET FOREIGN_KEY_CHECKS = 1;";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
        if (err) {
          res.status(500).send({ errorMessage: err.message });
        } else {
          let obj = null;
          new Promise((resolve) => {
            obj = JSON.parse(data);
            if (obj) {
              resolve();
            }
          }).then(() => {
            new Promise((resolve) => {
              obj[0].app.titleincurent = "Titre en cours...";
              obj[0].app.artistincurrent = "Artiste en cours...";
              resolve();
            }).then(() => {
              const newData = JSON.stringify(obj);
              fs.writeFile(jsonPath, newData, "utf8", function () {
                res.status(200).json(newData);
              });
            });
          });
        }
      });
      // res.sendStatus(200);
    }
  });
});

module.exports = router;
