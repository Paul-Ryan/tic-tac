// module pattern - invoked function, single instance of module
const GameBoard = (() => {
  let board = new Array(null, null, null, null, null, null, null, null, null);
  const getBoard = () => board;

  const resetBoard = (disable = false) => {
    board = board.map(() => null);
    const squares = document.querySelectorAll(".square");
    toggleDisabled();
    squares.forEach((square) => square.classList);
    displayController.renderBoard();
  };

  const toggleDisabled = () => {
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => square.classList.toggle("disabled"));
  };

  const clickSquare = (event) => {
    // check if square is free
    // update square for current player
    // return if success or failure
  };

  const handleSquare = (event) => {
    const { target } = event;
    const idx = target.dataset.id;
    const playerSymbol = gameController?.getCurrentPlayer()?.getSymbol();

    if (board[idx] === null && playerSymbol) {
      board[idx] = playerSymbol;
      displayController.renderBoard();
      gameController.changePlayer();
      gameController.checkForWin();
    }
  };

  return { getBoard, resetBoard, updateSpace: handleSquare };
})();

// factory function - returns an object
const Player = (name, symbol) => {
  getName = () => name;
  getSymbol = () => symbol;

  return { getName, getSymbol };
};

const gameController = (() => {
  let gameOver = true;
  let players = [];
  let currentPlayerIdx = 0;
  const changePlayer = () => {
    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
  };

  const checkForWin = () => {
    const board = GameBoard.getBoard();
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
    console.log("winner", winner);
  };

  const getCurrentPlayer = () => players[currentPlayerIdx];

  const start = () => {
    const startButton = document.querySelector(".start");
    const newText = GameBoard.getBoard().some((value) => value)
      ? "Start"
      : "Reset";
    startButton.innerText = newText;

    if (gameOver) {
      const player1 = Player("Paul", "X");
      const player2 = Player("Bart", "O");

      players.push(player1, player2);
      GameBoard.resetBoard(false);
      resetGame();
    } else {
      GameBoard.resetBoard(true);
      players = [];
      endGame();
    }
  };

  const resetGame = () => (gameOver = false);
  const endGame = () => (gameOver = true);

  return { changePlayer, checkForWin, getCurrentPlayer, start };
})();

const displayController = (() => {
  const renderBoard = () => {
    const squares = document.querySelectorAll(".square");
    const board = GameBoard.getBoard();
    squares.forEach((square) => {
      const idx = square.dataset.id;
      square.innerHTML = board[idx];
    });
  };

  const _init = (() => {
    renderBoard();
    const squares = document.querySelectorAll(".square");
    const startButton = document.querySelector(".start");

    startButton.addEventListener("click", gameController.start);
    squares.forEach((square) => {
      square.addEventListener("click", GameBoard.updateSpace);
    });
  })();

  return { renderBoard };
})();
