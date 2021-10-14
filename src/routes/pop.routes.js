const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth");
var moment = require("moment");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM popup";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get("/available", (req, res) => {
  const sql = "SELECT * FROM popup WHERE expire_at > current_timestamp;";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM popup WHERE id=?";
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/", (req, res) => {
  let data = req.body;
  const send_date = moment().format("YYYY-MM-DD HH:mm:ss");
  const timer_before_expire = parseInt(data.time);
  const expire_date = moment()
    .add(timer_before_expire, "m")
    .format("YYYY-MM-DD HH:mm:ss");

  data = {
    ...data,
    send_at: send_date,
    expire_at: expire_date,
    time: timer_before_expire,
  };

  const sql = "INSERT INTO popup SET ? ";
  connection.query(sql, data, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(201).json({ id: results.insertId, ...data });
    }
  });
});

router.put("/:id", verifyJWT, (req, res) => {
  let sql = "UPDATE popup SET ? WHERE id=?";
  connection.query(sql, [req.body, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      sql = "SELECT * FROM popup WHERE id=?";
      connection.query(sql, req.params.id, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            errorMessage: `popup with id ${req.params.id} not found`,
          });
        } else {
          res.status(200).json(result[0]);
        }
      });
    }
  });
});

module.exports = router;
