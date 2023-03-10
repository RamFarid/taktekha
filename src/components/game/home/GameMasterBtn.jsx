import { AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'
import { GrFormAdd } from 'react-icons/gr'
const GameMaster = React.lazy(() => import('../../Models/GameMaster'))

function GameMasterBtn() {
  const [isGameMaster, setIsGameMaster] = useState(false)
  const [pageI, setPageI] = useState(0)
  const openGameMasterHandler = () => {
    setIsGameMaster(true)
    setPageI(0)
  }
  return (
    <React.Fragment>
      <button
        aria-label='Join and Create games'
        className='game-master-btn'
        onClick={openGameMasterHandler}
      >
        <GrFormAdd size={25} />
      </button>
      <AnimatePresence key={'gameMaster'}>
        {isGameMaster && (
          <GameMaster
            setIsPortal={setIsGameMaster}
            pageI={pageI}
            setPageI={setPageI}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  )
}

export default GameMasterBtn
