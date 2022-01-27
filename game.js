// module pattern - invoked function, single instance of module
const GameBoard = (() => {
  const board = new Array(null, null, null, null, null, null, null, null, null);
  const getBoard = () => board;
  const updateSpace = (event) => {
    console.log(event);

    gameController.changePlayer();
  };

  return { getBoard, updateSpace };
})();

// factory function - returns an object
const playerFactory = (name, symbol) => {
  getName = () => name;
  getSymbol = () => symbol;

  return { getName, getSymbol };
};

const gameController = (() => {
  let currentPlayer = 1;
  const changePlayer = () => {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  };

  return { currentPlayer, changePlayer };
})();

const displayController = (() => {
  const _init = (() => {
    const squares = document.querySelectorAll(".square");
    const board = GameBoard.getBoard();
    squares.forEach((square) => {
      const idx = square.dataset.id;
      square.innerHTML = board[idx];
      square.addEventListener("click", GameBoard.updateSpace);
    });
  })();
})();
