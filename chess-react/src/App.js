import React, { useState, useEffect } from 'react';
import ChessBoardComponent from './components/ChessBoard';
import EvaluationBar from './components/EvaluationBar';
import AnalysisPanel from './components/AnalysisPanel';
import MoveHistory from './components/MoveHistory';
import ThemeSelector from './components/ThemeSelector';
import { useChessEngine } from './hooks/useChessEngine';
import { useAnalysis } from './hooks/useAnalysis';
import './styles/Chess.css';


function App() {
  const { fen, moveHistory, status, makeMove, newGame, undoMove } = useChessEngine();
  const { topMoves, evaluation, isAnalyzing, analyze, getHint } = useAnalysis();
  const [theme, setTheme] = useState('wikipedia');

  useEffect(() => {
    analyze(fen);
  }, [fen, analyze]);

  const handleMove = async (from, to) => {
    const result = await makeMove(from, to);
    return result;
  };

  const handleHint = async () => {
    const hint = await getHint();
    alert(`Hint: ${hint}`);
  };

  return (
    <div className='container'>
      <div className='header'>
        <h1>Chess vs Stockfish - Pro Edition (React)</h1>
        <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
      </div>

      <div className='main-content'>
        <div className='left-panel'>
          <EvaluationBar evaluation={evaluation} />
          <div className='panel-section'>
            <h3>Best Moves</h3>
            <AnalysisPanel topMoves={topMoves} isAnalyzing={isAnalyzing} />
          </div>
        </div>

        <div className='board-container'>
          <div id='status'>{status}</div>
          <ChessBoardComponent fen={fen} onMove={handleMove} theme={theme} />
          <div className='controls'>
            <button className='btn-primary' onClick={newGame}>New Game</button>
            <button className='btn-secondary' onClick={handleHint}>Get Hint</button>
            <button className='btn-secondary' onClick={undoMove}>Undo Move</button>
            <button className='btn-secondary' onClick={() => analyze(fen)}>Analyze</button>
          </div>
        </div>

        <div className='right-panel'>
          <div className='panel-section'>
            <h3>Move History</h3>
            <MoveHistory history={moveHistory} />
          </div>
          <div className='panel-section'>
            <h3>Game Modes</h3>
            <button className='btn-secondary' style={{ width: '100%', marginBottom: '10px' }}>
              Practice Mode
            </button>
            <button className='btn-secondary' style={{ width: '100%', marginBottom: '10px' }}>
              Puzzle Solver (Coming Soon)
            </button>
            <button className='btn-secondary' style={{ width: '100%' }}>
              Opening Trainer (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
