import React from 'react';
import ScoreBoard from './ScoreBoard';
import Board from './Board';
import Turn from './Turn';
import Status from './Status';
import base from '../base';

class Game extends React.Component {
  constructor() {
    super();
    this.recordTurn = this.recordTurn.bind(this);
    this.checkWinner = this.checkWinner.bind(this);
    this.resetBoard = this.resetBoard.bind(this);

    this.state = {
      game: false
    }
  }

  componentWillMount() {
    this.ref = base.syncState(
      `game/${this.props.params.gameId}`,
      {
        context: this,
        state: 'game'
      }
    );
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  recordTurn(cellNumber) {
    let game = {...this.state.game};
    if (game.board[cellNumber]) {
      return;
    }
    if (game.status !== 'playing') {
      return;
    }
    game.board[cellNumber] = game.turn === 1 ? "X" : "O";
    game.turn = game.turn === 1 ? 2 : 1;
    game = this.checkWinner(game);
    this.setState({game});
  }

  resetBoard() {
    const game = {...this.state.game};
    for (let i = 1; i <= 9; i++) {
      game.board[i] = "";
    }
    game.status = "playing";
    game.statusMessage = "";
    this.setState({game});
  }

  checkWinner(game) {
    console.log("checking winner");
    const board = game.board;

    const winningCombos = [
      [board[1], board[2], board[3]],
      [board[4], board[5], board[6]],
      [board[7], board[8], board[9]],
      [board[1], board[4], board[7]],
      [board[2], board[5], board[8]],
      [board[3], board[6], board[9]],
      [board[1], board[5], board[9]],
      [board[3], board[5], board[7]]
    ];

    const xWon = winningCombos.some((combo) => {
      return combo.join('') === 'XXX';
    });

    if (xWon) {
      game.player1Wins += 1;
      game.statusMessage = `${game.player1Name} has won!`;
    }

    const oWon = winningCombos.some((combo) => {
      return combo.join('') === 'OOO';
    });

    if (oWon) {
      game.player2Wins += 1;
      game.statusMessage = `${game.player2Name} has won!`;
    }

    if (xWon || oWon) {
      game.status = "winner";
    } else {
      // check if board is full
      var emptyCell = 0;
      for (var cell in game.board) {
        if (game.board[cell] === "") {
          emptyCell++;
        }
      }
      if (emptyCell === 0) {
        game.status = "draw";
        game.statusMessage = "Game Over...";
      }
    }

    return game;
  }

  render() {

    if(!this.state.game) {
      return (
        <p>Loading...</p>
      )
    }

    return (
      <div className="container">
        <ScoreBoard player1Name={this.state.game.player1Name}
          player2Name={this.state.game.player2Name}
          player1Wins={this.state.game.player1Wins}
          player2Wins={this.state.game.player2Wins}
        />
        <Board board={this.state.game.board}
          recordTurn={this.recordTurn}
        />
        <Turn player1Name={this.state.game.player1Name}
          player2Name={this.state.game.player2Name}
          turn={this.state.game.turn}
        />
      {
        (this.state.game.status === "winner" ||  this.state.game.status === "draw") &&
        <Status status={this.state.game.status} statusMessage={this.state.game.statusMessage} resetBoard={this.resetBoard} />
      }
      </div>
    )
  }
}

export default Game;