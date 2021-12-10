const { connection } = require("../db_connection");
const router = require("express").Router();
const { verifyJWT } = require("../middlewares/isuserauth.js");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const front = process.env.DEV
  ? `${__dirname}/../../client/public`
  : `${__dirname}/../../client/build`;

router.get("/", (req, res) => {
  const sql = "SELECT * FROM event_picture;";
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

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

router.get("/download", (req, res) => {
  const uploadDir = fs.readdirSync(front + "/eventpicture");
  const zip = new AdmZip();

  for (var i = 0; i < uploadDir.length; i++) {
    zip.addLocalFile(front + "/eventpicture/" + uploadDir[i]);
  }

  // Define zip file name
  const downloadName = `${Date.now()}.zip`;
  const data = zip.toBuffer();

  // save file zip in root directory
  zip.writeZip(front + "/zipfolders/" + downloadName);

  // code to download zip file
  res.set("Content-Type", "application/octet-stream");
  res.set("Content-Disposition", `attachment; filename=${downloadName}`);
  res.set("Content-Length", data.length);
  res.status(200).send(data);
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

router.delete("/cleanall", (req, res) => {
  const directory = front + "/eventpicture";

  new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return res.status(500).send({ err: err.message });
      }
      for (const file of files) {
        if (file != "read.md") {
          fs.unlink(path.join(directory, file), (err) => {
            reject(file);
          });
        }
      }
      resolve();
    });
  })
    .then(() => {
      const sql = "TRUNCATE event_picture;";
      connection.query(sql, (err) => {
        if (err) {
          res.status(500).send({ errorMessage: err.message });
        } else {
          res.sendStatus(200);
        }
      });
    })
    .catch((file) => {
      res.status(500).send({ err: "Probleme with file remove", file: file });
    });
});

module.exports = router;
