import React from 'react'
import ReactDOM from 'react-dom'
import DateInput from '../game/home/DateInput'
import DataWrapper from '../reusable/DataWrapper'
import SingleDataGame from '../reusable/SingleDataGame'
import { AnimatePresence, motion } from 'framer-motion'
import { useUser } from '../../contexts/UserContext'
import PortalsTopBar from '../reusable/PortalsTopBar'

import '../../Styles/portals.css'
import { useSearchParams } from 'react-router-dom'
function GamesHistory() {
  const { gamesHistory } = useUser()
  const [searchParams, setSearchParams] = useSearchParams()
  const closePortal = () => {
    setSearchParams({})
  }

  return ReactDOM.createPortal(
    <AnimatePresence key={'gameHistoryModel'}>
      {Number(searchParams.get('games_history')) && (
        <motion.section
          className='games-history'
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 100,
          }}
        >
          <PortalsTopBar closePortal={closePortal} title='Games History' />
          <DateInput />
          <DataWrapper>
            {gamesHistory.length > 0
              ? gamesHistory.map((game) => {
                  return <SingleDataGame data={game} key={game.id} />
                })
              : null}
          </DataWrapper>
        </motion.section>
      )}
    </AnimatePresence>,
    document.getElementById('portals')
  )
}

export default GamesHistory
