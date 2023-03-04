import React, { useState } from 'react'
import PortalsTopBar from '../../reusable/PortalsTopBar'
import { motion } from 'framer-motion'
import { AiOutlineThunderbolt } from 'react-icons/ai'
import { GiCrossedSabres, GiTicTacToe, GiTurtleShell } from 'react-icons/gi'
import Ripples from 'react-ripples'
import ComingSoon from './ComingSoon'
import { useGameData } from '../../../contexts/GameContext'
import Loader from '../../reusable/Loader'
import { useUser } from '../../../contexts/UserContext'
function CreateGameMaster({ changePageI, friendToInvite }) {
  const [loader, setLoader] = useState(false)
  const { createLazyGame } = useGameData()
  const { inviteFriend } = useUser()

  const clickOnLazy = () => {
    setLoader(true)
    if (friendToInvite) {
      inviteFriend(friendToInvite)
      setLoader(false)
      changePageI(false)
      return
    }
    const isAllowed = createLazyGame()
    if (isAllowed === false) {
      setLoader(false)
    }
  }

  return (
    <motion.div
      className='create-master-wrapper'
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <PortalsTopBar
        title={
          friendToInvite ? (
            <React.Fragment>
              Challenge
              <GiCrossedSabres />
            </React.Fragment>
          ) : (
            'Create yours'
          )
        }
        closePortal={() => changePageI(0)}
      />

      <div className='body'>
        <ComingSoon top={'75%'} left={'25%'} />
        <ComingSoon top={'25%'} left={'75%'} />

        <Ripples className='single-game-card' onClick={clickOnLazy}>
          <div className='img-co'>
            <GiTurtleShell size={36} fill={'#718b5a'} />
          </div>
          <h4>Lazy</h4>
          <p className='sub-txt'>Game without any time.</p>
        </Ripples>
        <Ripples className='single-game-card disabled avoid-pointer-events'>
          <div className='img-co'>
            <AiOutlineThunderbolt size={36} fill={'var(--primary-color)'} />
          </div>
          <h4>Quick</h4>
          <p className='sub-txt'>Play a quick game in 14 seconds</p>
        </Ripples>
        <Ripples className='single-game-card disabled avoid-pointer-events'>
          <div className='img-co'>
            <GiTicTacToe size={36} />
          </div>
          <h4>Classic</h4>
          <p className='sub-txt'>Play a game with 4 seconds/turn</p>
        </Ripples>
      </div>
      {loader && <Loader />}
    </motion.div>
  )
}

export default CreateGameMaster
