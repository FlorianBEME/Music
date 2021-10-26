const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth.js");

/**
 * @api {get} /user Request User information
 * @apiName GetUser
 * @apiGroup User
 * @apiSuccess {Array} List List of users.
 */

router.get("/", (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});
/**
 * @api {post} /user Add new User
 * @apiName AddUser
 * @apiBody {Object} UserInformation Object contain all Information
 * @apiHeader {String} acces-token
 * @apiGroup User
 * @apiSuccess {Object} User Contain user information
 */
router.post("/", verifyJWT, (req, res) => {
  const sql = "INSERT INTO users SET ?";
  connection.query(sql, req.body, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  });
});

/**
 * @api {put} /user/{param} Modify User
 * @apiName ModyifyUser
 * @apiGroup User
 * @apiHeader {String} acces-token
 * @apiParam {Number} id Users unique ID.
 * @apiSuccess {Object} User Contain user information
 */
router.put("/:id", verifyJWT, (req, res) => {
  let sql = "UPDATE users SET ? WHERE id=?";
  connection.query(sql, [req.body, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      sql = "SELECT * FROM users WHERE id=?";
      connection.query(sql, req.params.id, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            errorMessage: `Question with id ${req.params.id} not found`,
          });
        } else {
          res.status(200).json(result[0]);
        }
      });
    }
  });
});
/**
 * @api {delete} /user/{param} Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * @apiHeader {String} acces-token
 * @apiParam {Number} id Users unique ID.
 * @apiSuccess {Object} User Contain user information
 */
router.delete("/:id", verifyJWT, (req, res) => {
  const sql = "DELETE FROM users WHERE id=?";
  connection.query(sql, req.params.id, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
