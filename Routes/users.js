const { GameUser } = require("../models/user.model");
const { register, login } = require('../controller/user.controller');
const express = require("express");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// userId,socket.id,socket
const registerUser = async(userId, socketId, socket) => {
    try {

        let user = await GameUser.findOne({ 'userId': userId })

        if (!user) {

            let userObj = new GameUser({
                userId,
                coins: 1000,
            })

            user = await userObj.save()
            console.log(user);
            socket.emit("userDetails", {
                user,
            });
        } else {
            socket.emit("userDetails", {
                user,
            });
        }

    } catch (error) {
        console.error("Error initializing game state:", error.message);
    }
};
module.exports = { registerUser };





// const { GameState } = require("./models/test.model");

// const initializeGameState = async (userId,docid, socketId,socket) => {
//   try {
//     // Attempt to find the user's existing game state in the database
//     let existingGameState = await GameState.findById(docid);

//     socket.to(socketId).emit("gameUpdate", {
//       existingGameState,
//     });
//   } catch (error) {
//     console.error("Error initializing game state:", error.message);
//   }
// };
// module.exports = { initializeGameState };
module.exports = router;