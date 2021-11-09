const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth");

/**
 * @api {get} /visitor Get All Visitor
 * @apiName GetVisitor
 * @apiGroup Visitor
 * @apiSuccess {Array} List List of Visitor
 */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM visitor";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      Promise.all(
        results.map((visitor) => {
          return new Promise((resolve) => {
            const sql = `SELECT COUNT(*) FROM currentsongs where visitor_id = ${visitor.id}`;
            connection.query(sql, (err, count) => {
              const newData = { ...visitor, countsubmit: count[0]["COUNT(*)"] };
              resolve(newData);
            });
          });
        })
      ).then((data) => {
        res.status(200).json(data);
      });
    }
  });
});

/**
 * @api {get} /visitor/{id} Get Spécific visitor
 * @apiName GetOneVisitor
 * @apiParam {Number} id Users unique ID.
 * @apiGroup Visitor
 * @apiSuccess {Array} List List of visitor.
 */
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM visitor WHERE id=?";
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

/**
 * @api {post} /visitor Add new Visitor
 * @apiName AddVisitor
 * @apiBody {Object} UserInformation Object contain all Information
 * @apiBody {String} uuid Number unique
 * @apiBody {String} pseudo Pseudo of User
 * @apiBody {Boolean} isNotAllowed If user Don't have permission
 * @apiHeader {String} acces-token
 * @apiGroup Visitor
 * @apiSuccess {Object} User Contain user information
 */
router.post("/", (req, res) => {
  const sql = "INSERT INTO visitor SET ? ";
  const visitor = { ...req.body, countVoting: 0 };
  connection.query(sql, visitor, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(201).json({ id: results.insertId, ...req.body });
    }
  });
});

/**
 * @api {post} /visitor/{id} Verify if Visitor Exist
 * @apiName VerifyUser
 * @apiBody {String} uuid Number unique
 * @apiParam {Number} id Unique ID
 * @apiGroup Visitor
 * @apiSuccess {Object} Status Contain if exist or not
 */
router.post("/:id", (req, res) => {
  const uuid = req.body.uuid;
  if (!uuid) {
    res.status(400).json({ errorMessage: "Please specify uuid" });
  } else {
    const sql = "SELECT * FROM visitor WHERE id = ? ;";
    connection.query(sql, req.params.id, (err, result) => {
      if (result.length > 0) {
        if (result[0].uuid === uuid) {
          res.status(200).send({ status: true });
        } else {
          res.status(200).send({ status: false });
        }
      } else {
        res.status(400).json({ errorMessage: "no Equal" });
      }
    });
  }
});

/**
 * @api {put} /visitor/{param} Modify Visitor
 * @apiName ModyifyVisitor
 * @apiGroup Visitor
 * @apiHeader {String} acces-token
 * @apiParam {Number} id Users unique ID.
 * @apiSuccess {Object} Visitor Contain user information
 */
router.put("/:id", verifyJWT, (req, res) => {
  let sql = "UPDATE visitor SET ? WHERE id=?";
  connection.query(sql, [req.body, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      sql = "SELECT * FROM visitor WHERE id=?";
      connection.query(sql, req.params.id, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            errorMessage: `visitor with id ${req.params.id} not found`,
          });
        } else {
          res.status(200).json(result[0]);
        }
      });
    }
  });
});

/**
 * @api {put} /visitor/newcount/{param} Modify CountVoting
 * @apiName ModifyCountVoting
 * @apiGroup Visitor
 * @apiParam {Number} id Users unique ID.
 * @apiSuccess {Object} Visitor Contain user information
 */
router.patch("/newcount/:id", (req, res) => {
  console.log("test");
  let sql = "UPDATE visitor SET ? WHERE id=?";
  let newCount = { countvoting: req.body.countvoting };
  connection.query(sql, [newCount, req.params.id], (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      sql = "SELECT * FROM visitor WHERE id=?";
      connection.query(sql, req.params.id, (err, result) => {
        if (result.length === 0) {
          res.status(404).send({
            errorMessage: `visitor with id ${req.params.id} not found`,
          });
        } else {
          console.log(result);
          res.status(200).json(result[0]);
        }
      });
    }
  });
});

module.exports = router;
