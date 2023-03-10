import { AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import Ripples from 'react-ripples'
import { useGameData } from '../../../contexts/GameContext'
const UserAccountInfo = React.lazy(import('../../Models/UserAccountInfo'))
function UserBoard({ user }) {
  const { onlineGame } = useGameData()
  const [userAccount, setUserAccount] = useState(false)
  return (
    <figure className='game-user'>
      <Ripples
        className='game-user-wrapper'
        onClick={() => setUserAccount(true)}
      >
        <div className='user-photo'>
          <img
            src={user?.photo}
            alt={user?.displayName}
            referrerPolicy='no-referrer'
          />
        </div>
        {onlineGame.mode.toLowerCase() === 'lazy' ? null : (
          <div className='time'>00:14</div>
        )}
      </Ripples>
      <AnimatePresence key={'accountInfo'}>
        {userAccount && (
          <UserAccountInfo
            setVisibility={setUserAccount}
            friendDataFromUsersCollection={user}
          />
        )}
      </AnimatePresence>
    </figure>
  )
}

export default UserBoard
