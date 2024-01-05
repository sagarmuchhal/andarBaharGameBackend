const { MainCard } = require("../models/test.model");
const { GameUser } = require("../models/user.model");

const handleBait = (userId, socket) => {
  socket.on("bait", async (data) => {
    const { baitType, coins,cardId } = data;
    console.log("baitcardid",cardId);
    try {
      const user = await GameUser.findOne({ userId: userId });
      if (!user) {
        return;
      }
      let updatedCoins = user.coins - coins;

      const mainCard = await MainCard.findById(cardId);
      if (!mainCard) {
        return;
      }
      user.coins = updatedCoins;
      if (baitType == "andar") {
        let sum = mainCard.andar + coins;
        mainCard.andar = sum;
      } else if (baitType == "bahar") {
        let sum = mainCard.bahar + coins;
        mainCard.bahar = sum;
      }
      
      mainCard.total=mainCard.bahar+mainCard.andar
      await mainCard.save();

      await user.save();

      socket.emit("bait", user);
    } catch (error) {}
  });
};

module.exports = { handleBait };
