const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: String,
    coins: Number,
}, { versionKey: false })

const GameUser = mongoose.model('gameuser', userSchema)
module.exports = { GameUser }