const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const { connection } = require("./db");
const http = require("http");
const { GameState, MainCard } = require("./models/test.model");
require("dotenv").config();
const { registerUser } = require("./Routes/users");
const { TimerMainCardFunction, cardID, gameCardHandler } = require("./Routes/mainCard");
const { handleBait } = require("./Routes/handleBait");
const userRoutes = require('./Routes/users');
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const bcrypt = require("bcryptjs");
app.use(express.json());
app.use('/user', userRoutes);
app.use(cors());
const io = socketIO(server);
const userConnections = new Map();
app.get('/', (req, res) => {
    res.send("server is running");
})

let userId;
io.on("connection", (socket) => {
    console.log("A user connected");
    // console.log(socket);
    userId = socket.handshake.query.userId;
    userConnections.set(userId, socket.id);
    console.log(userConnections);
    registerUser(userId, socket.id, socket);
    handleBait(userId, socket);
    const changeStream = GameState.watch();
    changeStream.on("change", async(change) => {
        const main_card = await MainCard.findById(cardID.cardID)
            // Send the updated game state to the connected client
        socket.emit("gameUpdate", { gamestate: change.updateDescription.updatedFields, mainCard: main_card });
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected");
        // Clean up resources associated with the user ID when the socket disconnects
        userConnections.delete(userId);
    });
});

// timer and main card function
TimerMainCardFunction();
server.listen(PORT, async() => {
    try {
        await connection;
        console.log("Connected to DB");
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});