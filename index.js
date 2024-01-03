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

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(cors());

const io = socketIO(server);

const userConnections = new Map();

app.get('/',()=>{
  console.log("server is running");
})

let userId;
let flag=true
io.on("connection", (socket) => {
  console.log("A user connected");
  // console.log(socket);
  userId = socket.handshake.query.userId;
  // if (userConnections.has(userId)) {
  //   registerUser(userId,socket.id,socket);

  //   const changeStream = GameState.watch();
  //   changeStream.on("change", (change) => {
  //     // Send the updated game state to the connected client
  //     socket.emit("gameUpdate", change.updateDescription.updatedFields);
  //   });
  // } else {
  userConnections.set(userId, socket.id);
  console.log(userConnections);

  registerUser(userId, socket.id, socket);

  handleBait(userId, socket);
if(flag){
  flag=false
  setTimeout(() => {
    gameCardHandler(socket)
    flag=true
  }, 1000);   
}

  const changeStream = GameState.watch();
  // const maincardStream=MainCard.watch()
  changeStream.on("change", async(change) => {
    const main_card=await MainCard.findById(cardID.cardID)
    // Send the updated game state to the connected client
    socket.emit("gameUpdate", {gamestate:change.updateDescription.updatedFields,mainCard:main_card});
  });
  // maincardStream.on("change", (change) => {
  //   // Send the updated game state to the connected client
  //   socket.emit("mainCard", change.fullDocument);
  // });
  // }
  let count = 0;
  // console.log(socket);
  socket.on("click", () => {
    count = count + 1;
    socket.emit("clickrec", socket.handshake.query.userId);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Clean up resources associated with the user ID when the socket disconnects
    userConnections.delete(userId);
  });
});

// timer and main card function

TimerMainCardFunction();

server.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
