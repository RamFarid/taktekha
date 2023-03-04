import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { FiRotateCw } from 'react-icons/fi'
import SingleTurn from '../../components/game/board/SingleTurn'
import Chat from '../../components/Models/Chat'
import { useGameData } from '../../contexts/GameContext'

import '../../Styles/board.css'
import HomeBtn from '../../components/game/board/HomeBtn'
function Board() {
  const { gameState, dispatch } = useGameData()
  const [chatAppear, setChatAppear] = useState(false)
  useEffect(() => {
    dispatch({ type: 'first_init', payload: { turn: 'x', mode: 'LOCAL' } })
  }, [dispatch])
  return (
    <section className='game-board'>
      <HomeBtn />
      <div
        className='game-status'
        style={
          gameState.status.isEnded &&
          gameState.turn === 'x' &&
          gameState.status.endWith === 'win'
            ? { color: 'var(--primary-color)' }
            : gameState.status.isEnded &&
              gameState.turn === 'o' &&
              gameState.status.endWith === 'win'
            ? { color: 'var(--light-strict)' }
            : null
        }
      >
        {/* <div className='btn'>
          <AiOutlineArrowLeft />
        </div> */}
        {!gameState.status.isEnded
          ? `${gameState.turn.toUpperCase()} turn`
          : gameState.status.isEnded && gameState.status.endWith === 'drew'
          ? `It's tie!`
          : gameState.status.isEnded && gameState.status.endWith === 'win'
          ? `${gameState.turn.toUpperCase()} win!`
          : null}
        {/* <div className='btn'>
          <AiOutlineArrowRight />
        </div> */}
      </div>
      <div
        className={
          gameState.status.isEnded ? 'board avoid-pointer-events' : 'board'
        }
      >
        {gameState.board.map((move, key) => (
          <SingleTurn move={move} key={key} index={key} />
        ))}
      </div>
      <AnimatePresence key={'endButton'}>
        {gameState.status.isEnded && (
          <motion.button
            initial={{ scale: 0.6, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0.5 }}
            className='end-btn'
            onClick={() => {
              dispatch({ type: `${gameState.status.endWith}_reset` })
            }}
          >
            <FiRotateCw size={20} /> One more
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence key={'chatModal'}>
        {chatAppear ? <Chat setChatAppear={setChatAppear} /> : null}
      </AnimatePresence>
    </section>
  )
}

export default Board
