const express = require("express");
const EmployeModel = require("../Schema/employeSchema");
const CheckLogin = require("../middleware/checkLogin");
const UserModel = require("../Schema/userSchema");

// define router

const router = express.Router();

// GET REQUEST FOR ALL EMPLOYE

router.get("/list", CheckLogin, (req, res) => {
    EmployeModel.find()
        .populate("user", "name email -_id")
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({ message: "Sorry Can't Find any Employe" });
        });
});

// POST REQUEST FOR EMPLOYE

router.post("/add", CheckLogin, async(req, res) => {
    const addEmploye = new EmployeModel({
        ...req.body,
        user: req.userId,
    });
    try {
        const employe = await addEmploye.save();
        await UserModel.updateOne({ _id: req.userId }, {
            $push: {
                employe: employe._id,
            },
        });
        res.status(200).json({ message: "Successfully Added New Employe" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Sorry failed to add Employe" });
    }
});

module.exports = router;