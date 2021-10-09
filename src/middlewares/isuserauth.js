require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).json("Vous n'êtes pas autorisé à vous connecter");
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        res
          .status(401)
          .json({
            auth: false,
            errorMessage: "L'authentification a échouée",
            status: 401,
          });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

module.exports = {
  verifyJWT: verifyJWT,
};
