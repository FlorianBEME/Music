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
            res.status(201).json({ id: results.insertId, ...req.body });
          }
        });
      }
    } else {
      res.status(500).send({ error: "Visiteur Inconnu" });
    }
  });
});

router.put("/:id", (req, res) => {
  const sql = "SELECT * FROM visitor WHERE id=?";
  connection.query(sql, req.body.visitor_id, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    }
    if (results.length > 0) {
      if (results[0].isNotAllowed) {
        res.status(401).send({ error: "Pas autorisé" });
      } else {
        let sql = "UPDATE currentsongs SET ? WHERE id=?";
        connection.query(sql, [req.body, req.params.id], (err, results) => {
          if (err) {
            res.status(500).send({ errorMessage: err.message });
          } else {
            sql = "SELECT * FROM currentsongs WHERE id=?";
            connection.query(sql, req.params.id, (err, result) => {
              if (result.length === 0) {
                res.status(404).send({
                  errorMessage: `Song with id ${req.params.id} not found`,
                });
              } else {
                res.status(200).json(result[0]);
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

module.exports = router;
