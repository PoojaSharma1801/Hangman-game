const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");


const soundWin = new Audio("sounds/win.mp3");
const soundLose = new Audio("sounds/lose.mp3");

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
  correctLetters = [];
  wrongGuessCount = 0;
  hangmanImage.src = "images/hangman-0.svg";
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
  keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
  gameModal.classList.remove("show");
};

const getRandomWord = () => {
  const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
  currentWord = word;
  document.querySelector(".hint-text b").innerText = hint;
  resetGame();
};

const gameOver = (isVictory) => {
  const modalText = isVictory ? "You found the word:" : "The correct word was:";
  gameModal.querySelector("img").src = `images/${isVictory ? "victory" : "lost"}.gif`;
  gameModal.querySelector("h4").innerText = isVictory ? "Congrats!" : "Game Over!";
  gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
  gameModal.classList.add("show");
};

const initGame = (button, clickedLetter) => {
  soundClick.play(); // Play click sound on every guess

  if (currentWord.includes(clickedLetter)) {
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        correctLetters[index] = letter;
        const letterEl = wordDisplay.querySelectorAll("li")[index];
        letterEl.innerText = letter;
        letterEl.classList.add("guessed");
      }
    });
  } else {
    wrongGuessCount++;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
  }

  button.disabled = true;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  if (wrongGuessCount === maxGuesses) {
    // Play fall sound then lose sound, then show game over
    soundFall.play();
    setTimeout(() => {
      soundLose.play();
      gameOver(false);
    }, 600); // delay for fall sound to start first
    return;
  }

  // Win condition: check if all letters have been guessed
  const allLettersGuessed = [...currentWord].every((letter, index) => correctLetters[index] === letter);
  if (allLettersGuessed) {
    soundWin.play();
    gameOver(true);
  }
};

// Create A-Z keyboard
for (let i = 97; i <= 122; i++) {
  const button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

// Start game
getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
