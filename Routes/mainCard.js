const { GameState, MainCard } = require("../models/test.model");

const dummyDeck = [
  "2 of Hearts",
  "3 of Hearts",
  "4 of Hearts",
  "5 of Hearts",
  "6 of Hearts",
  "7 of Hearts",
  "8 of Hearts",
  "9 of Hearts",
  "10 of Hearts",
  "Jack of Hearts",
  "Queen of Hearts",
  "King of Hearts",
  "Ace of Hearts",
  "2 of Diamonds",
  "3 of Diamonds",
  "4 of Diamonds",
  "5 of Diamonds",
  "6 of Diamonds",
  "7 of Diamonds",
  "8 of Diamonds",
  "9 of Diamonds",
  "10 of Diamonds",
  "Jack of Diamonds",
  "Queen of Diamonds",
  "King of Diamonds",
  "Ace of Diamonds",
  "2 of Clubs",
  "3 of Clubs",
  "4 of Clubs",
  "5 of Clubs",
  "6 of Clubs",
  "7 of Clubs",
  "8 of Clubs",
  "9 of Clubs",
  "10 of Clubs",
  "Jack of Clubs",
  "Queen of Clubs",
  "King of Clubs",
  "Ace of Clubs",
  "2 of Spades",
  "3 of Spades",
  "4 of Spades",
  "5 of Spades",
  "6 of Spades",
  "7 of Spades",
  "8 of Spades",
  "9 of Spades",
  "10 of Spades",
  "Jack of Spades",
  "Queen of Spades",
  "King of Spades",
  "Ace of Spades",
];

const cardID = { cardID: null };
const TimerMainCardFunction = async () => {
  // const startTimer=()=>{
  //   setTimeout(() => {
  //     timer()
  //   }, 3000);
  // }

  try {
    //   socket.on("timer1", () => {
    function timer() {
      let value = 5;
      let Interval1 = setInterval(async () => {
        value = value - 1;

        if (value == 0) {
          // startTimer()
          MainCardGenerator();
          // drawcard
          // clearInterval(Interval1);

          value = 30;
        }
        let existingDocument = await GameState.findById("val1");

        // Update the existing document or create a new one
        if (!existingDocument) {
          // If the document with ID 'val1' doesn't exist, create a new one
          const newDocument = new GameState({
            value,
            state: "Waiting",
            _id: "val1",
            // MainCard:,
          });
          await newDocument.save();
        } else {
          existingDocument.value = value;
          // existingDocument.state = "Waiting";
          await existingDocument.save();
        }
      }, 1000);
    }
    timer();
  } catch (error) {
    // console.log(error.message);
  }
};

// MainCardGenerator
let deck = [];
let randomWinCard;
const MainCardGenerator = async () => {
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King",
    "Ace",
  ];

  // Create a deck with multiple suits for each rank
  deck = [];
  for (const rank of ranks) {
    for (const suit of suits) {
      const card = { rank, suit };
      deck.push(card);
    }
  }

  shuffle(deck);
  console.log("dekh127", deck.length);

  // Draw a random card
  const drawnCard = deck.pop();
  const randomCard = CardNameGenerator(drawnCard);
  console.log("rand1123", randomCard);

  let mainCard = new MainCard({
    main_card: randomCard,
    andar: 0,
    bahar: 0,
    total: 0,
    baharcards: [],
    andarcards: [],
    winstatus: "",
  });
  let cardCreated = await mainCard.save();
  cardID.cardID = cardCreated._id;
  console.log(cardID);
  // OtherCards
  const OtherCards = deck.filter((card, index) => {
    if(card.rank == drawnCard.rank && card.suit !== drawnCard.suit){
      let cardl=deck.splice(index,1)
      return cardl;
    }
  });
  console.log(OtherCards);
  if (OtherCards.length > 0) {
    const randomCardIndex = Math.floor(Math.random() * OtherCards.length);
    const randomWinCardObj = OtherCards[randomCardIndex];

    randomWinCard = CardNameGenerator(randomWinCardObj);
    console.log("rand1", randomWinCard);
  }
};

// card shuffler
const shuffle = (deck) => {
  for (let i = 0; i < deck.length - 1; i++) {
    let j = Math.floor(Math.random() * (deck.length - i)) + i;
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

// CardNameGenerator
const CardNameGenerator = (card) => {
  console.log("card", card);
  const createCard = `${card.rank} of ${card.suit}`;
  return createCard;
};

const gameCardHandler = (socket) => {
  socket.on("gameCards", async (gameId) => {
    console.log("gameId-179", gameId);

    const min = 2;
    const max = 5;
    const andarcards = [];
    const baharcards = [];
    let randomNumber = Math.floor(Math.random() * (max - min) + 1) + min;

    const mainCard = await MainCard.findById(gameId);

    // if (!mainCard) {
    //   socket.emit("gamecardError", { msg: "maincard not Found" });
    // }
    if (mainCard.andar > mainCard.bahar && mainCard.total !== 0) {
      if (randomNumber % 2 == 0) {
        randomNumber += 1;
      }
      mainCard.winstatus = "Bahar";
    } else if (mainCard.andar < mainCard.bahar && mainCard.total !== 0) {
      mainCard.winstatus = "Andar";
    }

    for (let i = 0; i < randomNumber; i++) {
      const drawcard1 = deck.splice(deck[i], 1);
      const drawcard2 = deck.splice(deck[i], 1);
      let card1 = CardNameGenerator(drawcard1[0]);
      let card2 = CardNameGenerator(drawcard2[0]);
      andarcards.push(card1);
      baharcards.push(card2);
    }
    if (mainCard.andar > mainCard.bahar && mainCard.total !== 0) {
      baharcards.push(randomWinCard);
    } else if (mainCard.andar < mainCard.bahar && mainCard.total !== 0) {
      andarcards.push(randomWinCard);
    }

    mainCard.andarcards = andarcards;
    mainCard.baharcards = baharcards;

    await mainCard.save();
    console.log("10sec", deck.length, randomNumber);
  });
};

module.exports = { TimerMainCardFunction, cardID, gameCardHandler };
