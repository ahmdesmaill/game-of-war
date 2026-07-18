const buttonElements = {
  newDeck: document.getElementById("new-deck-button"),
  draw: document.getElementById("draw-button"),
};

const labelElements = {
  computerScore: document.getElementById("computer-score-label"),
  playerScore: document.getElementById("player-score-label"),
  remainingCards: document.getElementById("remaining-cards-label"),
  gameStatus: document.getElementById("game-status-label"),
};

const cardPlaceholders = [
  document.getElementById("card1-placeholder"),
  document.getElementById("card2-placeholder"),
];

const gameData = { deckId: "", computerScore: 0, playerScore: 0 };
const cardValueRanks = {
  2: 0,
  3: 1,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  10: 8,
  JACK: 9,
  QUEEN: 10,
  KING: 11,
  ACE: 12,
};

buttonElements.newDeck.addEventListener("click", async (e) => {
  const result = await fetch(
    "https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/",
  );
  const data = await result.json();
  gameData.deckId = data.deck_id;
  gameData.computerScore = 0;
  gameData.playerScore = 0;
  cardPlaceholders[0].innerHTML = "";
  cardPlaceholders[1].innerHTML = "";

  labelElements.gameStatus.textContent = "Game of War";
  labelElements.remainingCards.textContent = `Remaining cards: ${data.remaining}`;
  labelElements.computerScore.textContent = "Computer score: 0";
  labelElements.playerScore.textContent = "My score: 0";
  buttonElements.draw.disabled = false;
});

buttonElements.draw.addEventListener("click", async (e) => {
  const result = await fetch(
    `https://apis.scrimba.com/deckofcards/api/deck/${gameData.deckId}/draw/?count=2`,
  );
  const data = await result.json();
  const [card1, card2] = data.cards;
  cardPlaceholders[0].innerHTML = `<img class="card-img" src="${card1.image}" alt="${card1.value} of ${card1.suit}" />`;
  cardPlaceholders[1].innerHTML = `<img class="card-img" src="${card2.image}" alt="${card2.value} of ${card2.suit}" />`;
  labelElements.gameStatus.textContent = handleRoundWinner(card1, card2);
  labelElements.remainingCards.textContent = `Remaining cards: ${data.remaining}`;
  labelElements.computerScore.textContent = `Computer score: ${gameData.computerScore}`;
  labelElements.playerScore.textContent = `My score: ${gameData.playerScore}`;

  if (data.remaining === 0) {
    buttonElements.draw.disabled = true;
    labelElements.gameStatus.textContent = getFinalWinnerString();
  }
});

function handleRoundWinner(card1, card2) {
  const score1 = cardValueRanks[card1.value];
  const score2 = cardValueRanks[card2.value];
  if (score1 > score2) {
    gameData.computerScore++;
    return "Computer won!";
  } else if (score1 < score2) {
    gameData.playerScore++;
    return "You won!";
  } else {
    return "War!";
  }
}

function getFinalWinnerString() {
  const prefix = "Final winner: ";
  if (gameData.computerScore > gameData.playerScore) {
    return prefix + "Computer!";
  } else if (gameData.computerScore < gameData.playerScore) {
    return prefix + "You!";
  } else {
    return "The game is a tie!";
  }
}
