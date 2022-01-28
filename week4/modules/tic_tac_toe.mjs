
export class TicTacToe {

  constructor(cellSelector, resetSelector) {
    this.cellSelector = cellSelector;
    document.querySelector(resetSelector).addEventListener('click', this.resetGame);
    this.resetGame();
    console.log(this.board);
  }

  initializeBoard() {
    const cells = Array.from(document.querySelectorAll(this.cellSelector))

    if (cells.length !== 9) {
      alert('Hey this board has an incorrect number of cells');
    }

    this.board = [];

    let row = [];
    cells.forEach((element, index) => {
      const cell = {
        el: element,
        value: '',
      };
      row.push(cell);

      const clickCallback = () => {
        cell.value = this.currentPlayer;
        cell.el.children[0].innerText = cell.value;
        this.switchPlayer();
      };

      [ 'ontouchend', 'click' ].forEach((event) => {
        element.removeEventListener(event, clickCallback);
        element.addEventListener(event, clickCallback);
      });

      if ((index + 1) % 3 === 0) {
        this.board.push(row);
        row = [];
      }
    });
  }


  clickCell(event) {

    if (!this.checkForWinner()) {
      this.switchPlayer();
    }
  }

  getGameState() {

  }

  checkForWinner() {
    return true;
  }

  switchPlayer() {
    if (this.currentPlayer === 'X') {
      this.currentPlayer = 'O';
    } else {
      this.currentPlayer = 'X';
    }

    return this.currentPlayer;
  }

  resetGame() {
    this.initializeBoard();

    this.currentPlayer = 'X';
  }

}
