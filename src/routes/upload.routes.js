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
const sharp = require("sharp");
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
      let event = results[0];
      console.log(event);
      if (event.bg_music !== null) {
        // si un bg est deja assigné on supprime le ficheier existant
        fs.unlink(`${front}/uploads/${event.bg_music}`, (err) => {
          if (err) {
            return res.status(500).send({ errorMessage: err.message });
          } else {
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
        });
      } else {
        // si pas de BG assigné
        console.log("ici");
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
  // on déplace le fichier dans le dossier (original)
  new Promise((resolve, reject) => {
    file.mv(`${front}/eventpicture/original/${file.name}`, async (err) => {
      if (err) {
        reject(err);
        return res.status(500).send(err);
      } else {
        resolve();
      }
    });
  }).then(() => {
    // on vérifie que ma photo existe dans le dossier original
    if (fs.existsSync(`${front}/eventpicture/original/${file.name}`)) {
      // On lis le fichier JSON qui contient la status d'acceptation par défault
      fs.readFile(jsonPath, "utf8", function readFileCallback(err, data) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          // on set le status dans une variable et on compresse et stock le fichier dans un autre dossier
          new Promise(async (resolve, reject) => {
            response = JSON.parse(data);
            if (response) {
              await sharp(`${front}/eventpicture/original/${file.name}`)
                .jpeg({ quality: 20 })
                .toFile(front + "/eventpicture/compress/" + file.name);
              resolve();
            }
          }).then(() => {
            //on stock les valeurs dans la BDD
            const sql = "INSERT INTO event_picture SET ?;";
            const data = {
              name: file.name,
              is_accept: response[0].app.defaultPictureAccept ? true : false,
              original: `/eventpicture/original/${file.name}`,
              source: `/eventpicture/compress/${file.name}`,
            };
            connection.query(sql, data, (err, results) => {
              if (err) {
                return res.status(500).send({ errorMessage: err.message });
              } else {
                res.json({ ...data, id: results.insertId }).status(200);
              }
            });
          });
        }
      });
    }
  });
});

module.exports = router;
