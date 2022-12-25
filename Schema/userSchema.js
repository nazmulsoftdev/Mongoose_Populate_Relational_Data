const mongoose = require("mongoose");

// define here user schema and types
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    employe: [{
        type: mongoose.Types.ObjectId,
        ref: "employes",
    }, ],
});

// define here user model

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;