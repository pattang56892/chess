import React, { useEffect, useRef } from 'react';

const ChessBoardComponent = ({ fen, onMove, theme = 'wikipedia' }) => {
  const boardRef = useRef(null);
  const chessboardRef = useRef(null);

  const themes = {
    wikipedia: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
    alpha: 'https://chessboardjs.com/img/chesspieces/alpha/{piece}.png',
    uscf: 'https://chessboardjs.com/img/chesspieces/uscf/{piece}.png',
    green: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
  };

  useEffect(() => {
    if (boardRef.current && !chessboardRef.current && window.Chessboard) {
      const config = {
        draggable: true,
        position: fen,
        onDragStart: (source, piece) => {
          return piece.search(/^b/) === -1;
        },
        onDrop: async (source, target) => {
          const result = await onMove(source, target);
          return result ? null : 'snapback';
        },
        pieceTheme: themes[theme]
      };
      
      chessboardRef.current = window.Chessboard(boardRef.current, config);
      
      if (theme === 'green') {
        boardRef.current.classList.add('board-green');
      }
    }

    return () => {
      if (chessboardRef.current && chessboardRef.current.destroy) {
        chessboardRef.current.destroy();
        chessboardRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (chessboardRef.current) {
      chessboardRef.current.position(fen);
    }
  }, [fen]);

  useEffect(() => {
    if (chessboardRef.current && boardRef.current) {
      boardRef.current.classList.remove('board-green');
      
      if (theme === 'green') {
        boardRef.current.classList.add('board-green');
      }
      
      chessboardRef.current.destroy();
      const config = {
        draggable: true,
        position: fen,
        onDragStart: (source, piece) => piece.search(/^b/) === -1,
        onDrop: async (source, target) => {
          const result = await onMove(source, target);
          return result ? null : 'snapback';
        },
        pieceTheme: themes[theme]
      };
      chessboardRef.current = window.Chessboard(boardRef.current, config);
    }
  }, [theme]);

  return <div ref={boardRef} style={{ width: '550px' }} />;
};

export default ChessBoardComponent;