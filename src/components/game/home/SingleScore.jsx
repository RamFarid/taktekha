import React from 'react'

function SingleScore({ scoreType, score }) {
  return (
    <div className='single-score'>
      <div className='score-no'>{score}</div>
      <div className='score-type'>{scoreType}</div>
    </div>
  )
}

export default SingleScore
