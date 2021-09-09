const guesses = document.querySelector(".guessed-letters");
// where your guessed letters will appear
const guessButton = document.querySelector(".guess");
// the button with "guess" in it
const letterInput = document.querySelector(".letter");
// where the player enters text
const progress = document.querySelector(".word-in-progress")
// where the word in progress will appear
const remaining = document.querySelector(".remaining");
// paragraph where the remaining guesses will appear
const remainingSpan = document.querySelector(".remaining span")
// span in paragraph where remaining guesses will appear
const message = document.querySelector(".message");
// where messages will appear when players guess a letter
const playAgainButton = document.querySelector(".play-again")
// hidden: appears when it's time to play again
let word = "";
// starting word to test the script
let guessedLetters = [];
// this will contain the players guesses
let remainingGuesses = 8;
// maximum number of guesses the player can make

const getWord = async function () {
    const request = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const data = await request.text();
    // console.log(data);
    const wordArray = data.split("\n");
    // console.log(wordArray);
    const randomWordIndex = Math.floor(Math.random() * wordArray.length);
    const randomWord = wordArray[randomWordIndex];
    randomWord.trim();
    console.log(`Random word: ${randomWord}`);
    word = randomWord;

    let freshWord = [];

    for (let letter of word) {
        freshWord.push("●");
    }

    progress.innerText = freshWord.join("");
}

getWord();

// const makeWord = function (word) {
//     const freshWord = [];

//     for (let letter of word) {
//         freshWord.push("●");
//     }

//     progress.innerText = freshWord.join("");
// }

// makeWord(word); obsoleted once we made getWord()

guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    const inputValue = letterInput.value;

    checkInput (inputValue);
    letterInput.value = "";
})

const checkInput = function (inputValue) {
    const acceptedLetter = /[a-zA-Z]/
    inputValue = inputValue.toUpperCase();

    if (inputValue != "") {
        if (inputValue.length === 1) {
            if (inputValue.match(acceptedLetter)) {
                if (!guessedLetters.includes(inputValue)) {
                    message.innerText = `You guessed "${inputValue}".`;
                    guessedLetters.push(inputValue);
                    // console.log(guessedLetters);
                    displayGuesses(guessedLetters);
                    updateWip(guessedLetters);
                    guessCountdown(inputValue);

                    return inputValue;
                } else {
                    message.innerText = `You already guessed ${inputValue}!`;
                }    
            } else {
                message.innerText = "Letters only please!"
            }
        } else {
            message.innerText = "Too many characters, no cheating!"
        }
    } else {
        message.innerText = "Please input something!"
    }
}

// const makeGuess = function (inputValue) {
//     inputValue = inputValue.toUpperCase();
//
//     if (guessedLetters.includes(inputValue)) {
//         message.innerText = `You've already guessed ${inputValue}!`;
//     } else {
//         guessedLetters.push(inputValue);
//         console.log(guessedLetters);
//     }
// } Kind of made this unncessary by adding it to checkInput()

const displayGuesses = function (guessedLetters) {
    guesses.innerHTML = "";

    guesses.append(guessedLetters);
}

const updateWip = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    // console.log(wordArray);
    const buildWord = [];

    for (let letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            buildWord.push(letter);
        } else {
            buildWord.push("●");
        }
    }

    progress.innerText = buildWord.join("");
    console.log(`buildWord: ${buildWord}`);
    checkIfWin();
}

const checkIfWin = function () {
    if (word.toUpperCase() === progress.innerText) {
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
        startOver();
    } else {

    }
}

const guessCountdown = function (inputValue) {
    const upperWord = word.toUpperCase();
    const upperInput = inputValue.toUpperCase();

    if (upperWord.includes(inputValue)){
        message.innerText = 'That was a good guess!';
    } else {
        message.innerText = "That guess wasn't part of the word. :/";
        remainingGuesses -= 1;
        remainingSpan.innerText = `${remainingGuesses} guesses`;
        if (remainingGuesses === 0) {
            message.innerText = "You ran out of guesses. Try again?";
            progress.innerText = word.toUpperCase();
            startOver();
        }
    }
}

const startOver = function () {
    guessButton.classList.add("hide");
    remaining.classList.add("hide");
    guesses.classList.add("hide");
    playAgainButton.classList.remove("hide");
    remainingGuesses = 8;
    guessedLetters = [];
}

playAgainButton.addEventListener("click", function () {
    if (message.classList.contains("win")) {
        message.classList.remove("win");
        message.innerHTML = "";
        guessButton.classList.remove("hide");
        remaining.classList.remove("hide");
        guesses.classList.remove("hide");
        playAgainButton.classList.add("hide");
        remainingSpan.innerText = `${remainingGuesses} guesses`;
        guesses.innerText = "";
        getWord();
    } else {
        guessButton.classList.remove("hide");
        remaining.classList.remove("hide");
        guesses.classList.remove("hide");
        playAgainButton.classList.add("hide");
        guesses.innerText = "";
        message.innerHTML = "";
        remainingSpan.innerText = `${remainingGuesses} guesses`;
        getWord();
    }
})