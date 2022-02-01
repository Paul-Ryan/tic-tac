// module pattern - invoked function, single instance of module
// this is basically an object
// Controls Board logistics
const gameBoard = (() => {
  let board = Array(9).fill(null);
  const squares = document.querySelectorAll(".square");
  const getBoard = () => board;

  const resetBoard = (disable = false) => {
    board = board.map(() => null);
    toggleDisabled();
    displayController.renderBoard();
  };

  const disableBoard = () => {
    squares.forEach((square) => square.classList.add("disabled"));
  };

  const toggleDisabled = () => {
    squares.forEach((square) => square.classList.toggle("disabled"));
  };

  const handleSquare = (event) => {
    const { target } = event;
    const idx = target.dataset.id;
    const playerSymbol = gameController?.getCurrentPlayer()?.getSymbol();
    let winner, draw;

    if (board[idx] === null && playerSymbol) {
      board[idx] = playerSymbol;
      displayController.renderBoard();
      gameController.changePlayer();
      winner = gameController.checkForWin();
      draw = gameController.checkForTie();
    }

    if (winner) {
      gameController.endGame(winner);
    }
    if (draw) {
      gameController.endGame();
    }
  };

  return { disableBoard, getBoard, resetBoard, updateSpace: handleSquare };
})();

// factory function - returns an object
const Player = (name, symbol) => {
  getName = () => name;
  getSymbol = () => symbol;

  return { getName, getSymbol };
};

// Controls game logic
const gameController = (() => {
  const gameStates = ["new", "playing", "over"];
  let currentGameState = gameStates[0];
  let gameOver = true;
  let players = [];
  let currentPlayerIdx = 0;
  const changePlayer = () => {
    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
  };

  const checkForWin = () => {
    const board = gameBoard.getBoard();
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [6, 4, 2],
      [0, 4, 8],
    ];

    const checkMatch = (spaceOne, spaceTwo, spaceThree) => {
      if (spaceOne && spaceOne === spaceTwo && spaceOne === spaceThree)
        return spaceOne;
    };

    const winner = winningPatterns.reduce((matchFound, [one, two, three]) => {
      const match = checkMatch(board[one], board[two], board[three]);
      return match && !matchFound ? match : matchFound;
    }, "");

    return winner;
  };

  const checkForTie = () => {
    const board = gameBoard.getBoard();
    const isTied = board.every((space) => space);
    return isTied;
  };

  const getCurrentPlayer = () => players[currentPlayerIdx];

  const start = () => {
    if (gameOver) {
      const player1 = Player("Paul", "X");
      const player2 = Player("Bart", "O");
      players.push(player1, player2);
      gameBoard.resetBoard(false);
      displayController.resetDisplay();
      resetGame();
    } else {
      gameBoard.resetBoard(true);
      players = [];
      endGame();
    }
  };

  const resetGame = () => (gameOver = false);

  const endGame = (winner) => {
    if (winner) {
      displayController.setWinner(winner);
    } else {
      displayController.setTie();
    }
    gameBoard.disableBoard();
    gameOver = true;
  };

  return {
    changePlayer,
    checkForTie,
    checkForWin,
    currentGameState,
    endGame,
    gameStates,
    getCurrentPlayer,
    start,
  };
})();

// Controls display of page
const displayController = (() => {
  const renderBoard = () => {
    const squares = document.querySelectorAll(".square");
    const board = gameBoard.getBoard();
    squares.forEach((square) => {
      const idx = square.dataset.id;
      square.innerHTML = board[idx];
    });
  };

  const updateStartButton = (gameState) => {
    const gameStates = gameController.gameStates;
    const startButton = document.querySelector(".start");

    if (gameState === gameStates[0]) {
      startButton.innerText = "Start";
    }

    if (gameState === gameStates[1] || gameState === gameStates[2]) {
      startButton.innerText = "Reset";
    }
  };

  const _init = (() => {
    renderBoard();
    const squares = document.querySelectorAll(".square");
    const startButton = document.querySelector(".start");

    startButton.addEventListener("click", gameController.start);
    squares.forEach((square) => {
      square.addEventListener("click", gameBoard.updateSpace);
    });
  })();

  const setTie = () => {
    const header = document.querySelector(".winner");
    const message = `Tie game!`;
    header.innerText = message;
    header.classList.remove("hidden");
  };

  const setWinner = (winner) => {
    const header = document.querySelector(".winner");
    const message = `${winner} is the winner!`;
    header.innerText = message;
    header.classList.remove("hidden");
  };

  const resetDisplay = () => {
    const header = document.querySelector(".winner");
    header.classList.add("hidden");
  };

  return { renderBoard, resetDisplay, setTie, setWinner, updateStartButton };
})();
