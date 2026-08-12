import { useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { TicTacToeBoard } from '../components/TicTacToeBoard';

type Cell = 'X' | 'O' | null;

const winLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function findWinningLine(cells: Cell[]) {
  return winLines.find(([a, b, c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) ?? [];
}

export function TicTacToePage() {
  const [cells, setCells] = useState<Cell[]>(Array(9).fill(null));
  const [nextPlayer, setNextPlayer] = useState<'X' | 'O'>('X');
  const winningCells = findWinningLine(cells);
  const winner = winningCells.length ? cells[winningCells[0]] : null;
  const isDraw = !winner && cells.every(Boolean);

  function makeMove(index: number) {
    if (cells[index] || winner) return;
    const nextCells = [...cells];
    nextCells[index] = nextPlayer;
    setCells(nextCells);
    setNextPlayer(nextPlayer === 'X' ? 'O' : 'X');
  }

  function restart() {
    setCells(Array(9).fill(null));
    setNextPlayer('X');
  }

  const status = winner ? `Player ${winner} wins! 🎉` : isDraw ? "It's a draw! 🤝" : `Player ${nextPlayer}'s turn`;

  return (
    <main className="container game-page">
      <GamePageHeader number="01" />
      <section className="game-panel">
        <span className="game-icon" aria-hidden="true">❌</span>
        <h1>Tic-Tac-Toe</h1>
        <p className={`game-status ${winner ? 'game-status--winner' : ''}`}>{status}</p>
        <TicTacToeBoard cells={cells} winningCells={winningCells} onCellClick={makeMove} />
        <button className="restart-button" onClick={restart}>Restart game</button>
      </section>
    </main>
  );
}
