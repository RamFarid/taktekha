import React, { useState } from 'react'
import HomeDataContainer from './HomeDataContainer'
import { useUser } from '../../../contexts/UserContext'
import GamesHistory from '../../Models/GamesHistory'
import EmptyMsg from '../../reusable/EmptyMsg'
import SingleDataHistory from '../../reusable/SingleDataGame'
function AccountData() {
  const { gamesHistory, gamesInProgress } = useUser()
  const [openGamesHistory, setOpenGamesHistory] = useState(false)
  const gameHistory = (e) => {
    if (gamesHistory.length === 0) return
    setOpenGamesHistory(true)
  }

  return (
    <React.Fragment>
      <section className='account-data-co'>
        <HomeDataContainer
          title={'Games History'}
          onClickContainer={gameHistory}
          length={gamesHistory.length === 0 ? null : gamesHistory.length}
        >
          {gamesHistory?.length === 0 ? (
            <EmptyMsg txt={'No games played!'} subtxt='Play some games' />
          ) : (
            gamesHistory.slice(0, 5).map((game) => {
              return (
                <SingleDataHistory data={game} key={game.id} outCo={true} />
              )
            })
          )}
        </HomeDataContainer>
        <HomeDataContainer
          title={'Games In progress'}
          length={gamesInProgress.length === 0 ? null : gamesInProgress.length}
        >
          {gamesInProgress?.length === 0 ? (
            <EmptyMsg
              txt={'No games in progress'}
              subtxt='The list of running games is clean!'
            />
          ) : (
            gamesInProgress.map((game) => {
              return <SingleDataHistory data={game} key={game.id} />
            })
          )}
        </HomeDataContainer>
      </section>
      <GamesHistory setPortal={setOpenGamesHistory} isOpen={openGamesHistory} />
    </React.Fragment>
  )
}

export default AccountData
