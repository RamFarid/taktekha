import React from 'react'
import { useGameData } from '../../../contexts/GameContext'
import { useUser } from '../../../contexts/UserContext'

function GameStatus({ anotherFriend }) {
  const { user } = useUser()
  const { turnStyleGenerator, onlineGame } = useGameData()
  return (
    <div className='game-status' style={turnStyleGenerator()}>
      {/* <div className='btn'>
          <AiOutlineArrowLeft />
        </div> */}
      {onlineGame.turn === user.uid && !onlineGame.status.isEnded
        ? 'Your turn'
        : onlineGame.status.isEnded &&
          onlineGame.status.endWith === user.uid &&
          onlineGame.status.endWith !== 'drew'
        ? 'You win 😄'
        : onlineGame.status.isEnded &&
          onlineGame.status.endWith !== user.uid &&
          onlineGame.status.endWith !== 'drew'
        ? `${anotherFriend.displayName} win 😔`
        : onlineGame.turn !== user.uid && !onlineGame.status.isEnded
        ? `${anotherFriend.displayName}'s turn`
        : "IT'S TIE"}
      {/* <div className='btn'>
          <AiOutlineArrowRight />
        </div> */}
    </div>
  )
}

export default GameStatus
