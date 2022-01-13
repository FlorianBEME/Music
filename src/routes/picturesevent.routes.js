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
  const uploadDir = fs.readdirSync(front + "/eventpicture/original");
  const zip = new AdmZip();

  const sql = "SELECT * FROM event_picture WHERE is_accept = 1";

  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send({ errorMessage: err.message });
    } else {
      let photosAccept = JSON.parse(JSON.stringify(results));

      for (let i = 0; i < uploadDir.length; i++) {
        console.log(typeof uploadDir[i]);
        if (photosAccept.includes((photo) => photo.original === uploadDir[i])) {
          console.log(uploadDir[i]);
          console.log(photo.original);
        }
        // zip.addLocalFile(front + "/eventpicture/original/" + uploadDir[i]);
      }
    }
  });

  // for (let i = 0; i < uploadDir.length; i++) {
  //   console.log(uploadDir[i]);
  //   zip.addLocalFile(front + "/eventpicture/original/" + uploadDir[i]);
  // }
  // // Define zip file name
  // const downloadName = `${Date.now()}.zip`;
  // const data = zip.toBuffer();

  // // // save file zip in root directory
  // zip.writeZip(front + "/zipfolders/" + downloadName);

  // // // code to download zip file
  // res.set("Content-Type", "application/octet-stream");
  // res.set("Content-Disposition", `attachment; filename=${downloadName}`);
  // res.set("Content-Length", data.length);
  // res.status(200).send(data);
});

router.delete("/cleanpicture", (req, res) => {
  const compress = front + "/eventpicture/compress";
  const original = front + "/eventpicture/original";

  new Promise((resolve, reject) => {
    fs.readdir(original, (err, files) => {
      if (err) {
        return res.status(500).send({ err: err.message });
      }
      for (const file of files) {
        if (file != "read.md") {
          fs.unlink(path.join(original, file), (err) => {
            reject(file);
          });
        }
      }
    });
    fs.readdir(compress, (err, files) => {
      if (err) {
        return res.status(500).send({ err: err.message });
      }
      for (const file of files) {
        if (file != "read.md") {
          fs.unlink(path.join(compress, file), (err) => {
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
