import { useEffect, useRef, useState } from 'react';
import { Chess, type PieceSymbol, type Square } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { ChessModeSelect, type ChessOpponent } from '../components/ChessModeSelect';
import { ChessMoves } from '../components/ChessMoves';
import { ChessRatingSelect } from '../components/ChessRatingSelect';
import { ChessVariantSelect, type ChessVariant } from '../components/ChessVariantSelect';
import { GamePageHeader } from '../components/GamePageHeader';
import { PromotionPicker } from '../components/PromotionPicker';
import { VariantChessGame } from '../components/VariantChessGame';
import { chooseBotMove, type ChessRating } from '../lib/chessBot';

type PromotionPiece = Exclude<PieceSymbol, 'p' | 'k'>;
type PendingPromotion = { from: Square; to: Square };

export function ChessPage() {
  const chess = useRef(new Chess());
  const [revision, refresh] = useState(0);
  const [variant, setVariant] = useState<ChessVariant | null>(null);
  const [opponent, setOpponent] = useState<ChessOpponent | null>(null);
  const [choosingRating, setChoosingRating] = useState(false);
  const [botRating, setBotRating] = useState<ChessRating>(800);
  const [selected, setSelected] = useState<Square | null>(null);
  const [promotion, setPromotion] = useState<PendingPromotion | null>(null);
  const legalMoves = selected ? chess.current.moves({ square: selected, verbose: true }) : [];
  const legalTargets = new Set(legalMoves.map((move) => move.to));
  const botThinking = variant === 'standard' && opponent === 'bot' && chess.current.turn() === 'b' && !chess.current.isGameOver();

  useEffect(() => {
    if (!botThinking) return;
    const timer = window.setTimeout(() => {
      chess.current.move(chooseBotMove(chess.current, botRating));
      refresh((value) => value + 1);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [botRating, botThinking, revision]);

  function selectSquare(square: Square) {
    if (promotion || botThinking || chess.current.isGameOver()) return;
    const piece = chess.current.get(square);
    if (!selected) {
      if (piece?.color === chess.current.turn()) setSelected(square);
      return;
    }
    const matchingMoves = legalMoves.filter((move) => move.to === square);
    if (matchingMoves.some((move) => move.promotion)) setPromotion({ from: selected, to: square });
    else if (matchingMoves.length) makeMove(selected, square);
    else setSelected(piece?.color === chess.current.turn() ? square : null);
  }

  function makeMove(from: Square, to: Square, promotionPiece?: PromotionPiece) {
    chess.current.move({ from, to, promotion: promotionPiece });
    setSelected(null);
    setPromotion(null);
    refresh((value) => value + 1);
  }

  function restart() {
    chess.current.reset();
    setSelected(null);
    setPromotion(null);
    refresh((value) => value + 1);
  }

  function chooseOpponent(nextOpponent: ChessOpponent) {
    if (nextOpponent === 'bot') setChoosingRating(true);
    else setOpponent('local');
  }

  function startBot(rating: ChessRating) {
    setBotRating(rating);
    setChoosingRating(false);
    setOpponent('bot');
  }

  function changeSetup() {
    chess.current.reset();
    setVariant(null);
    setOpponent(null);
    setChoosingRating(false);
    setSelected(null);
    setPromotion(null);
  }

  function getStatus() {
    const player = chess.current.turn() === 'w' ? 'White' : 'Black';
    if (chess.current.isCheckmate()) return `${player} is checkmated! ${player === 'White' ? 'Black' : 'White'} wins.`;
    if (chess.current.isStalemate()) return 'Stalemate — draw.';
    if (chess.current.isThreefoldRepetition()) return 'Draw by threefold repetition.';
    if (chess.current.isInsufficientMaterial()) return 'Draw — insufficient material.';
    if (chess.current.isDraw()) return 'The game is a draw.';
    if (botThinking) return `Bot ${botRating} is thinking…`;
    return `${opponent === 'bot' ? 'Your turn' : `${player} to move`}${chess.current.isCheck() ? ' — check!' : ''}`;
  }

  return (
    <main className="container game-page">
      <GamePageHeader number="08" />
      <section className="game-panel game-panel--chess">
        <span className="game-icon" aria-hidden="true">♟️</span>
        <h1>Chess</h1>
        {!variant ? <ChessVariantSelect onSelect={setVariant} />
          : !opponent ? choosingRating
            ? <ChessRatingSelect onSelect={startBot} onBack={() => setChoosingRating(false)} />
            : <ChessModeSelect onSelect={chooseOpponent} onBack={() => setVariant(null)} />
          : variant !== 'standard'
            ? <VariantChessGame mode={variant} opponent={opponent} botRating={botRating} onChangeMode={changeSetup} />
            : (
              <>
                {opponent === 'bot' && <span className="bot-rating-badge">Bot strength: ~{botRating}</span>}
                <p className={`game-status ${chess.current.isCheck() ? 'game-status--winner' : ''}`}>{getStatus()}</p>
                <div className="chess-layout">
                  <div>
                    <ChessBoard chess={chess.current} selected={selected} legalTargets={legalTargets} onSquareClick={selectSquare} />
                    {promotion && <PromotionPicker color={chess.current.turn()} onChoose={(piece) => makeMove(promotion.from, promotion.to, piece)} />}
                  </div>
                  <ChessMoves moves={chess.current.history()} />
                </div>
                <p className="game-hint">Select a piece, then choose a highlighted square. Castling and en passant are supported.</p>
                <div className="chess-actions"><button className="restart-button" onClick={restart}>New game</button><button className="mine-tool" onClick={changeSetup}>Change setup</button></div>
              </>
            )}
      </section>
    </main>
  );
}
