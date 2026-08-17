import { useState } from 'react';
import { GamePageHeader } from '../components/GamePageHeader';
import { MergeBoard } from '../components/MergeBoard';
import { MergeCollection } from '../components/MergeCollection';
import { MERGE_ITEMS, addMergeItem, canMerge, createMergeBoard, moveOrMerge } from '../lib/merge';

export function MergePage() {
  const [board, setBoard] = useState(createMergeBoard);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [notice, setNotice] = useState('Select two matching items to merge them.');
  const highestLevel = Math.max(0, ...board.map((item) => item ?? 0));
  const won = highestLevel === MERGE_ITEMS.length - 1;
  const full = board.every((item) => item !== null);
  const stuck = full && !canMerge(board);

  function selectCell(cell: number) {
    if (won || stuck) return;
    if (selected === null) {
      if (board[cell] !== null) setSelected(cell);
      return;
    }
    const result = moveOrMerge(board, selected, cell);
    if (result.board !== board) {
      setBoard(result.board);
      if (result.mergedLevel !== null) {
        const item = MERGE_ITEMS[result.mergedLevel];
        setScore((current) => current + result.mergedLevel * 25);
        setNotice(`Created ${item.symbol} ${item.name}!`);
      } else setNotice('Item moved.');
      setSelected(null);
      return;
    }
    setSelected(board[cell] === null ? null : cell);
    setNotice(board[cell] === board[selected] ? 'The final item cannot be merged further.' : 'Only matching items can merge.');
  }

  function findItem() {
    const next = addMergeItem(board);
    setBoard(next);
    setSelected(null);
    setNotice(next === board ? 'The board is full. Merge matching items.' : 'A new item was found!');
  }

  function restart() {
    setBoard(createMergeBoard());
    setSelected(null);
    setScore(0);
    setNotice('Select two matching items to merge them.');
  }

  const status = won ? 'Golden trophy created! 🎉' : stuck ? 'No more merges — try again!' : `Score: ${score}`;
  return (
    <main className="container game-page">
      <GamePageHeader number="18" />
      <section className="game-panel game-panel--merge">
        <span className="game-icon" aria-hidden="true">🧩</span><h1>Merge Garden</h1>
        <p className={`game-status ${won ? 'game-status--winner' : ''}`}>{status}</p>
        <MergeCollection highestLevel={highestLevel} />
        <MergeBoard board={board} selected={selected} onSelect={selectCell} />
        <p className="game-hint">{notice}</p>
        <div className="merge-actions"><button className="restart-button" disabled={full || won} onClick={findItem}>🔍 Find item</button><button className="mine-tool" onClick={restart}>Restart</button></div>
      </section>
    </main>
  );
}
