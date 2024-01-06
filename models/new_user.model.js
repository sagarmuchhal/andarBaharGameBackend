const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    mobile_no: { type: Number, required: true, unique: true },
    name: { type: String, require: true },
    user_name: { type: String, require: true },
    coins: { type: Number, require: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
}, { versionKey: false });

const NewUser = mongoose.model("NewUser", userSchema);

module.exports = NewUser;