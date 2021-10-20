const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth.js");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM footer_item";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/", verifyJWT, (req, res) => {
  const sql = "INSERT INTO footer_item SET ?";
  const newitem = { ...req.body, isActivate: true };
  connection.query(sql, newitem, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(201).json({ id: results.insertId, ...newitem });
    }
  });
});

router.put("/:id", verifyJWT, (req, res) => {
  let sql = "UPDATE footer_item SET ? WHERE id=?";
  connection.query(sql, [req.body, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      sql = "SELECT * FROM footer_item WHERE id=?";
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
  const sql = "DELETE FROM footer_item WHERE id=?";
  connection.query(sql, req.params.id, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
