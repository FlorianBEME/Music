const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth.js");

router.get("/available", (req, res) => {
  const sql = "SELECT * FROM event_picture WHERE is_accept = 1;";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

// router.post("/", (req, res) => {
//   const sql = "INSERT INTO currentsongs SET ?";
//   connection.query(sql, req.body, (err, results) => {
//     if (err) {
//       res.status(500).send({ errorMessage: err.message });
//     } else {
//       res.status(201).json({ id: results.insertId, ...req.body });
//     }
//   });
// });

// router.put("/:id", (req, res) => {
//   let sql = "UPDATE currentsongs SET ? WHERE id=?";
//   connection.query(sql, [req.body, req.params.id], (err, results) => {
//     if (err) {
//       res.status(500).send({ errorMessage: err.message });
//     } else {
//       sql = "SELECT * FROM currentsongs WHERE id=?";
//       connection.query(sql, req.params.id, (err, result) => {
//         if (result.length === 0) {
//           res.status(404).send({
//             errorMessage: `Question with id ${req.params.id} not found`,
//           });
//         } else {
//           res.status(200).json(result[0]);
//         }
//       });
//     }
//   });
// });

// router.delete("/:id", verifyJWT, (req, res) => {
//   const sql = "DELETE FROM currentsongs WHERE id=?";
//   connection.query(sql, req.params.id, (err, results) => {
//     if (err) {
//       res.status(500).send({ errorMessage: err.message });
//     } else {
//       res.sendStatus(200);
//     }
//   });
// });

module.exports = router;
