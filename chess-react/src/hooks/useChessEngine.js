import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import { chessAPI } from '../services/api';

export const useChessEngine = () => {
  const [game] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState('Your turn (White)');
  const [gameOver, setGameOver] = useState(false);

  const makeMove = useCallback(async (from, to) => {
    const move = game.move({ from, to, promotion: 'q' });
    if (!move) return false;

    const moveUci = from + to;
    try {
      const data = await chessAPI.makeMove(moveUci);
      game.load(data.fen);
      setFen(data.fen);
      setMoveHistory(data.move_history || []);
      
      if (data.game_over) {
        setStatus(`Game Over! Result: ${data.result}`);
        setGameOver(true);
      } else {
        setStatus(`Stockfish played: ${data.stockfish_move}`);
      }
      
      return data;
    } catch (error) {
      game.undo();
      console.error('Move error:', error);
      return false;
    }
  }, [game]);

  const newGame = useCallback(async () => {
    await chessAPI.newGame();
    game.reset();
    setFen(game.fen());
    setMoveHistory([]);
    setStatus('Your turn (White)');
    setGameOver(false);
  }, [game]);

  const undoMove = useCallback(() => {
    game.undo();
    game.undo();
    setFen(game.fen());
    setStatus('Your turn (White)');
  }, [game]);

  return {
    fen,
    moveHistory,
    status,
    gameOver,
    makeMove,
    newGame,
    undoMove,
    game
  };
};
