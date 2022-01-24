const Game = (() => {
  // module pattern - invoked function, single instance of module
  const GameBoard = (() => {
    const board = [null, "X", null, "O", null, null, null, null, null];

    getBoard = () => board;

    return { getBoard };
  })();

  // factory function - returns an object
  const playerFactory = (name, symbol) => {
    getName = () => name;
    getSymbol = () => symbol;

    return { getName, getSymbol };
  };

  const controlFlow = (() => {
    const currentPlayer = 1;
    const changePlayer = () => {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
    };

    return { currentPlayer, changePlayer };
  })();

  const selectSquare = () => {};

  return { GameBoard, playerFactory };
})();
