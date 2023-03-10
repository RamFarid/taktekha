import React from 'react'
import { useGameData } from '../../../contexts/GameContext'
import { useUser } from '../../../contexts/UserContext'
import SingleOnlineTurn from './SingleOnlineTurn'

function MainOnlineBoard({ game }) {
  const { user } = useUser()
  const { onlineGame } = useGameData()
  return (
    <div
      className={
        onlineGame.turn !== user.uid || onlineGame.status.isEnded
          ? 'board avoid-pointer-events'
          : 'board'
      }
    >
      {onlineGame.board.map((move, key) => (
        <SingleOnlineTurn move={move} key={key} index={key} />
      ))}
    </div>
  )
}

export default MainOnlineBoard
