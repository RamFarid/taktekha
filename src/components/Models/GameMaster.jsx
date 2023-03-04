import React from 'react'
import MainMaster from '../game/home/MainMaster'
import JoinMaster from '../game/home/JoinMaster'
import CreateGameMaster from '../game/home/CreateGameMaster'
import FloatingModel from './FloatingModel'

function GameMaster({ isPortal, setIsPortal, pageI, setPageI }) {
  return (
    <FloatingModel
      closePortal={(e) => {
        if (e.target.className === e.currentTarget.className) setIsPortal(false)
      }}
      className='game-master-wrapper'
    >
      {pageI === 0 ? (
        <MainMaster changePageI={setPageI} />
      ) : pageI === 1 ? (
        <JoinMaster changePageI={setPageI} />
      ) : pageI === 2 ? (
        <CreateGameMaster changePageI={setPageI} />
      ) : (
        <div>Error occured!</div>
      )}
    </FloatingModel>
  )
}

export default GameMaster
