const { connection } = require("../db_connection");
const router = require("express").Router();
const fileUpload = require("express-fileupload");
const front = process.env.DEV
  ? `${__dirname}/../../client/public`
  : `${__dirname}/../../client/build`;
const fs = require("fs");
const jsonPath = `${__dirname}/../json/appcommon.json`;
const { verifyJWT } = require("../middlewares/isuserauth");
router.use(fileUpload());
const { v4: uuidv4 } = require("uuid");

router.post("/bg/:id", verifyJWT, (req, res) => {
  let event = null;
  const file = req.files.file;
  const extension = file.name.split(".").pop();
  file.name = "bg-music." + extension;

  // On verifie si la requetes contien bien un fichier
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  // on va chercher l'events à modifier
  const sqlEvents = "SELECT * FROM events WHERE id=?";
  connection.query(sqlEvents, req.params.id, async (err, results) => {
    if (err) {
      return res.status(500).send({ errorMessage: err.message });
    } else {
      event = results[0];
      if (event.bg_music !== null) {
        // si un bg est deja assigné on supprime le ficheier existant
        fs.unlink(`${front}/uploads/${event.bg_music}`, (err) => {
          if (err) {
            return res.status(500).send({ errorMessage: err.message });
          } else {
            file.mv(`${front}/${file.name}`, (err) => {
              if (err) {
                return res.status(500).send(err);
              }
              res
                .json({
                  fileName: `/uploads/${file.name}`,
                  filePath: `/uploads/${file.name}`,
                })
                .status(200);
            });
          }
        });
      } else {
        // si pas de BG assigné
        file.mv(`${front}/uploads/${file.name}`, (err) => {
          if (err) {
            return res.status(500).send(err);
          }
          res
            .json({
              fileName: `/uploads/${file.name}`,
              filePath: `/uploads/${file.name}`,
            })
            .status(200);
        });
      }
    }
  });
});

router.post("/footer", verifyJWT, (req, res) => {
  console.log(req.files.file);
  const file = req.files.file;
  const extension = file.name.split(".").pop();
  const uuid = uuidv4();
  file.name = uuid + "." + extension;

  // On verifie si la requetes contien bien un fichier
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  file.mv(`${front}/footer/${file.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res
      .json({
        fileName: `/footer/${file.name}`,
        filePath: `/footer/${file.name}`,
      })
      .status(200);
  });
});

router.post("/popimage", verifyJWT, (req, res) => {
  const file = req.files.file;
  const extension = file.name.split(".").pop();
  const uuid = uuidv4();
  file.name = uuid + "." + extension;

  // On verifie si la requetes contient bien un fichier
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  file.mv(`${front}/popimage/${file.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log("fichier upload");
    res
      .json({
        fileName: `/popimage/${file.name}`,
        filePath: `/popimage/${file.name}`,
      })
      .status(200);
  });
});

router.post("/picture", (req, res) => {
  const file = req.files.file;
  const extension = file.name.split(".").pop();
  const uuid = uuidv4();
  file.name = uuid + "." + extension;
  let response;

  // On verifie si la requetes contient bien un fichier
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  new Promise((resolve, reject) => {
    file.mv(`${front}/eventpicture/${file.name}`, (err) => {
      if (err) {
        reject(err);
        return res.status(500).send(err);
      } else {
        resolve();
      }
    });
  }).then(() => {
    if (fs.existsSync(`${front}/eventpicture/${file.name}`)) {
      fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          new Promise((resolve, reject) => {
            response = JSON.parse(data);
            if (response) {
              resolve();
            }
          }).then(() => {
            const sql = "INSERT INTO event_picture SET ?;";
            const data = {
              is_accept: response[0].app.defaultPictureAccept ? true : false,
              source: `/eventpicture/${file.name}`,
            };
            connection.query(sql, data, (err, results) => {
              if (err) {
                return res.status(500).send({ errorMessage: err.message });
              } else {
                res
                  .json({
                    fileName: `/eventpicture/${file.name}`,
                    filePath: `/eventpicture/${file.name}`,
                  })
                  .status(200);
              }
            });
          });
        }
      });
    }
  });
});

module.exports = router;
