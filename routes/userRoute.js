const express = require("express");
const UserModel = require("../Schema/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// define router
const router = express.Router();

// GET ALL USER

router.get("/all", async(req, res) => {
    await UserModel.find()
        .populate("employe", "-user -_id")
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ message: "Sorry Can't Find any Employe" });
        });
});

//  THIS IS SINGUP POST REQUEST

router.post("/singup", async(req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    UserModel.findOne({ email: email }, async(err, user) => {
        if (user) {
            res.status(401).json({ message: "Sorry this Email already used !" });
        } else {
            const result = new UserModel({
                name: name,
                email: email,
                password: hashedPassword,
            });
            await result.save((err) => {
                if (err) {
                    res.status(401).json({ message: "Sorry something wen't wrong !" });
                } else {
                    res.status(200).json({ message: "Successfully Singup complete !" });
                }
            });
        }
    });
});

// THIS IS LOGIN POST REQUEST

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    UserModel.findOne({ email: email }, async(err, user) => {
        const validPassword = await bcrypt.compare(password, user.password);
        if (user) {
            if (validPassword) {
                // generate token
                const token = jwt.sign({ userId: user._id, userName: user.name },
                    process.env.SCRET_JWT_SIGNaTURE, { expiresIn: "1h" }
                );
                res.status(200).json({
                    access_token: token,
                    message: "Successfully Login",
                });
            } else {
                res.status(401).json({ message: "Email or Password not match" });
            }
        } else {
            res.status(401).json({ message: "Email or Password not match" });
        }
    });
});

module.exports = router;