const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth.js");

router.get("/", (req, res) => {
  const sql =
    "SELECT currentsongs.id, title,artist,countVote, unavailable,isValid,isNew,uuid,pseudo FROM currentsongs INNER JOIN visitor ON visitor_id = visitor.id";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/", (req, res) => {
  const sql = "SELECT * FROM visitor WHERE id=?";
  connection.query(sql, req.body.visitor_id, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    }
    if (results.length > 0) {
      if (results[0].isNotAllowed) {
        res.status(401).send({ error: "Pas autorisé" });
      } else {
        const sqlInsert = "INSERT INTO currentsongs SET ?";
        connection.query(sqlInsert, req.body, (err, results) => {
          if (err) {
            res.status(500).send({ errorMessage: err.message });
          } else {
            const sqlGet = `SELECT currentsongs.id ,visitor_id , title,artist,countVote, unavailable,isValid,isNew,uuid,pseudo FROM currentsongs INNER JOIN visitor ON visitor_id = visitor.id WHERE currentsongs.id=${results.insertId}`;
            connection.query(sqlGet, req.body, (err, el) => {
              if (err) {
                res.status(500).send({ errorMessage: err.message });
              } else {
                res.status(201).json(el[0]);
              }
            });
          }
        });
      }
    } else {
      res.status(500).send({ error: "Visiteur Inconnu" });
    }
  });
});

router.put("/:id", (req, res) => {
  const sql = "UPDATE currentsongs SET ? WHERE id=?";
  connection.query(sql, [req.body, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      const sqlSelect = "SELECT * FROM currentsongs WHERE id=?";
      connection.query(sqlSelect, req.params.id, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            errorMessage: `song with id ${req.params.id} not found`,
          });
        } else {
          res.status(200).json(result[0]);
        }
      });
    }
  });
});

router.delete("/:id", verifyJWT, (req, res) => {
  const sql = "DELETE FROM currentsongs WHERE id=?";
  connection.query(sql, req.params.id, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete("/remove/all", verifyJWT, (req, res) => {
  const sql = "DELETE FROM currentsongs; ";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
