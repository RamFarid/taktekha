import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/game/Nav'
import GamesHistoriesContextProvider from '../contexts/GamesHistoriesContext'

function Game() {
  return (
    <div className='app-wrapper'>
      <GamesHistoriesContextProvider>
        <Outlet />
        <Nav />
      </GamesHistoriesContextProvider>
    </div>
  )
}

export default Game
