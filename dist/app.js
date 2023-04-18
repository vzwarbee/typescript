"use strict";
const playerName = localStorage.getItem("player_name");
// console.log(playerName);
if (!playerName) {
    window.location = "/index.html";
}
const timerElement = document.getElementById("timer");
let startTime;
let intervalId;
let isRunning = false;
let elapsedTime = 0;
const formatTime = (time) => {
    const date = new Date(time);
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    // const milliseconds = Math.floor(date.getMilliseconds() / 10);
    return `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const tick = () => {
    const now = Date.now();
    const timeElapsed = now - startTime + elapsedTime;
    timerElement.textContent = formatTime(timeElapsed);
};
document.addEventListener("DOMContentLoaded", () => {
    const btnCancel = document.querySelector(".btn-cancel");
    const playerNameEL = document.querySelector(".player_name");
    playerNameEL.textContent = `${playerName}`;
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(tick, 10);
    btnCancel.addEventListener("click", () => {
        localStorage.removeItem("player_name");
        window.location = "/pages/game.html";
    });
    class CardSelector {
        constructor() {
            this.first = { id: -1, name: "first" };
            this.second = { id: -1, name: "second" };
            this.select = (cardId, name) => {
                if (this.first.id === -1) {
                    this.first = { id: cardId, name: name };
                }
                else if (this.first.id === cardId || this.second.id === cardId) {
                    console.error("duplicate selection");
                }
                else if (this.second.id === -1) {
                    this.second = { id: cardId, name: name };
                }
            };
            this.isFull = () => {
                return this.first.id !== -1 && this.second.id !== -1;
            };
            this.contains = (x) => {
                return this.first.id === x || this.second.id === x;
            };
            this.clear = () => {
                this.first = { id: -1, name: "first" };
                this.second = { id: -1, name: "second" };
            };
        }
    }
    const createBoard = () => {
        const grid = document.querySelector(".wrap-game");
        for (let i = 0; i < cardArray.length; i++) {
            let card = document.createElement("img");
            card.setAttribute("data-id", i.toString());
            card.setAttribute("draggable", "false");
            grid === null || grid === void 0 ? void 0 : grid.appendChild(card);
        }
        startGame();
    };
    const startGame = () => {

        cardArray.sort(() => 0.5 - Math.random());
        cardsWon = 0;
        updateScore();
        cardsChosen.clear();
        const images = document.querySelectorAll("img");
        images.forEach((node) => {
            if (!(node instanceof HTMLImageElement)) {
                throw new Error("Expected grid child nodes to be of type HTMLImageElement");
            }
            node.setAttribute("src", "../public/img/question.gif");
            node.addEventListener("click", flipCard);
        });
    };
    const updateScore = () => {
        if (resultDisplay) {
            resultDisplay.textContent = `${cardsWon} / ${cardArray.length / 2}`;
        }
    };
    const checkForMatch = () => {
        let cards = document.querySelectorAll("img");
        const { first, second } = cardsChosen;
        if (first.name === second.name) {
            cards[first.id].setAttribute("src", "../public/img/okImg.gif");
            cards[second.id].setAttribute("src", "../public/img/okImg.gif");
            cards[first.id].removeEventListener("click", flipCard);
            cards[second.id].removeEventListener("click", flipCard);
            cardsWon++;
            updateScore();
        }
        else {
            cards[first.id].setAttribute("src", "../public/img/question.gif");
            cards[second.id].setAttribute("src", "../public/img/question.gif");
        }
        cardsChosen.clear();
        if (cardsWon === cardArray.length / 2) {


            if (resultDisplay) {
                resultDisplay.textContent = "You Won!";
                isRunning = false;
                clearInterval(intervalId);
                elapsedTime = Date.now() - startTime + elapsedTime;
                const minutes = Math.floor(elapsedTime / 60000);
                const seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
                const timer = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
                const newRecord = { time: timer, name: playerName };
                let oldRecords = localStorage.getItem("transcript") || [];

                if (oldRecords) {
                    // Chuyển đổi dữ liệu từ JSON sang đối tượng JavaScript
                    oldRecords = JSON.parse(oldRecords);

                    // Thêm dữ liệu mới vào mảng
                    oldRecords.push(newRecord);
                    oldRecords.sort((a, b) => {
                        const timeA = parseInt(a.time.replace(':', ''));
                        const timeB = parseInt(b.time.replace(':', ''));
                        return timeA - timeB;
                    });

                    // Lưu mảng mới vào localStorage
                    localStorage.setItem("transcript", JSON.stringify(oldRecords));
                } else {
                    // Tạo một mảng mới và thêm dữ liệu vào mảng
                    const newRecords = [newRecord];

                    // Lưu mảng mới vào localStorage
                    localStorage.setItem("transcript", JSON.stringify(newRecords));
                }
            }
        }
    };
    const flipCard = (event) => {
        let card = event.target;
        let cardId = parseInt(card.getAttribute("data-id") || "-2");
        if (!cardsChosen.isFull() && !cardsChosen.contains(cardId)) {
            cardsChosen.select(cardId, cardArray[cardId].name);
            card.setAttribute("src", cardArray[cardId].img);
            if (cardsChosen.isFull()) {
                setTimeout(checkForMatch, 600);
            }
        }
    };
    let cardArray = new Array(6).fill(null).map((name, index) => ({
        name: `${index + 1}`,
        img: `../public/img/${index + 1}.png`,
    }));
    cardArray = [...cardArray, ...cardArray];
    const resultDisplay = document.querySelector("#current-score");
    const restartButton = document.querySelector(".btn-reset");
    restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener("click", () => {
        startGame()
        isRunning = true;
        elapsedTime = 0;
        timerElement.textContent = "00:00";
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(tick, 10);
    });
    const cardsChosen = new CardSelector();
    let cardsWon = 0;
    createBoard();
});


const transcript = JSON.parse(localStorage.getItem("transcript"))
const nameTable = document.getElementById("name-table")
transcript.sort((a, b) => a.time - b.time);
const customer = transcript.slice(0, 5)
customer.map((item, index) => {
    const textContent = `<a href="#" class="list-group-item list-group-item-action d-flex justify-content-between" key=${index}>${index + 1}- Tên: ${item?.name} <span class="text-left">Thời gian ${item?.time}</span></a>`

    nameTable.innerHTML += textContent
})


