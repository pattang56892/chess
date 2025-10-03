import React from 'react';

const EvaluationBar = ({ evaluation }) => {
  const percentage = Math.max(0, Math.min(100, 50 + (evaluation * 5)));
  
  return (
    <div className='panel-section'>
      <h3>Position Evaluation</h3>
      <div className='eval-bar-container'>
        <div className='eval-bar' style={{ width: `${percentage}%` }} />
        <div className='eval-text'>{evaluation.toFixed(1)}</div>
      </div>
    </div>
  );
};

export default EvaluationBar;
