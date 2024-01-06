const { default: mongoose } = require("mongoose");

const gameStateSchema = new mongoose.Schema({
    value: String,
    state: String,
    _id: String,
    status: String,
});

const MainCardSchema = new mongoose.Schema({
    main_card: String,
    andar: Number,
    bahar: Number,
    total: Number,
    baharcards: Array,
    andarcards: Array,
    winstatus: String,
}, { versionKey: false });

const MainCard = mongoose.model("MainCard", MainCardSchema);
const GameState = mongoose.model("GameState", gameStateSchema);

module.exports = { GameState, MainCard };