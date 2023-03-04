import React from 'react'
import { motion } from 'framer-motion'
import { useGameData } from '../../../contexts/GameContext'

function SingleOnlineTurn({ index, move }) {
  const { onlineGame, onlineMove } = useGameData()
  return (
    <div
      onClick={() => {
        onlineMove(index)
      }}
      className={
        move.turn.length !== 0
          ? `single-turn ${move.turn}-symbol avoid-pointer-events`
          : 'single-turn'
      }
    >
      {onlineGame.board[index].turn === 'x' ? (
        <React.Fragment>
          <motion.div
            className='slash'
            initial={{ height: 0 }}
            exit={{ height: 0 }}
            // transition={{ type: 'spring', stiffness: 500, damping: 100 }}
            animate={{ height: '50%' }}
          ></motion.div>
          <motion.div
            className='back-slash'
            initial={{ height: 0 }}
            // transition={{ type: 'spring', stiffness: 500, damping: 100 }}
            animate={{ height: '50%' }}
          ></motion.div>
        </React.Fragment>
      ) : onlineGame.board[index].turn === 'o' ? (
        <svg height='100' width='100'>
          <motion.circle
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
            exit={{ pathLength: 0 }}
            cx='50%'
            cy='50% '
            r='20'
            stroke='#FF827E'
            strokeWidth='3'
            fill='transparent'
          />
          O
        </svg>
      ) : null}
    </div>
  )
}

export default SingleOnlineTurn
