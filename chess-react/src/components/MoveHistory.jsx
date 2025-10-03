import React from 'react';

const MoveHistory = ({ history }) => {
  if (!history || history.length === 0) {
    return <div className='loading'>No moves yet</div>;
  }

  const moves = [];
  for (let i = 0; i < history.length; i += 2) {
    moves.push(
      <div key={i} className='history-move'>
        <span>{Math.floor(i / 2) + 1}.</span>
        <span>{history[i]?.move}</span>
        <span>{history[i + 1]?.move || ''}</span>
      </div>
    );
  }

  return <div className='move-history'>{moves}</div>;
};

export default MoveHistory;
