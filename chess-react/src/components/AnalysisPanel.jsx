import React from 'react';

const AnalysisPanel = ({ topMoves, isAnalyzing }) => {
  if (isAnalyzing) {
    return <div className='loading'>Analyzing...</div>;
  }

  if (!topMoves || topMoves.length === 0) {
    return <div className='loading'>Make a move to see analysis...</div>;
  }

  return (
    <>
      {topMoves.map((move) => (
        <div key={move.rank} className={`move-suggestion rank-${move.rank}`}>
          <div className='move-notation'>
            {move.rank}. {move.san} ({move.evaluation.toFixed(1)})
          </div>
          <div className='move-explanation'>{move.explanation}</div>
        </div>
      ))}
    </>
  );
};

export default AnalysisPanel;
