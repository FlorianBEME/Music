const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth.js");
const front = `${__dirname}/../../client/build`;
const fs = require("fs");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM footer_text_copyright";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/", verifyJWT, (req, res) => {
  const sql = "INSERT INTO footer_text_copyright SET ?";
  connection.query(sql, req.body, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(201).json({ id: results.insertId, ...newitem });
    }
  });
});

router.put("/:id", verifyJWT, (req, res) => {
  let sql = "UPDATE footer_text_copyright SET ? WHERE id=?";
  connection.query(sql, [req.body, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      sql = "SELECT * FROM footer_text_copyright WHERE id=?";
      connection.query(sql, req.params.id, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            errorMessage: `Item with id ${req.params.id} not found`,
          });
        } else {
          res.status(200).json(result[0]);
        }
      });
    }
  });
});

router.delete("/:id", verifyJWT, (req, res) => {
  const sql = "DELETE FROM footer_text_copyright WHERE id=?";
  connection.query(sql, req.params.id, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      // Suppression de l'image
      fs.unlink(`${front}${req.body.path}`, (err) => {
        if (err) {
          return res.status(500).send({ errorMessage: err.message });
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

module.exports = router;
