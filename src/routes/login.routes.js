const {connection} = require("../db_connection");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {verifyJWT} = require("../middlewares/isuserauth.js")

router.get("/", (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});
    }
});

router.get("/isuserauth", verifyJWT, (req, res) => {
    req.authenticated = true;
    res.json({auth: req.authenticated})

});

router.post("/", (req, res) => {
    const user_name = req.body.user_name;
    const user_password = req.body.user_password;
    if (!user_name || !user_password) {
        res
            .status(400)
            .json({errorMessage: "Please specify both email and password"});
    } else {
        connection.query(
            "SELECT * FROM users WHERE user_name = ? ;",
            user_name,
            (err, result) => {
                if (err) {
                    res.status(500).json({errorMessage: error.message});
                } else if (result.length === 0) {
                    res.status(403).json({errorMessage: 'Invalid email'});
                } else if (result.length > 0) {
                    bcrypt.compare(
                        user_password,
                        result[0].user_password,
                        (errror, response) => {
                            if (response) {
                                const user = {
                                    id: result[0].id,
                                    user_name,
                                    user_password: 'hidden',
                                };
                                const token = jwt.sign(
                                    {id: user.id},
                                    process.env.ACCESS_TOKEN_SECRET_KEY, {
                                        expiresIn: '1h',
                                    }
                                );

                                req.session.user = result;

                                res.json({auth: true, token: token, result: result});
                            } else {
                                res.status(403).json({errorMessage: 'Invalid password'});
                            }
                        }
                    );
                } else {
                    res.json({auth: false, message: "no user exist"});
                }
            }
        );
    }
});

module.exports = router;
