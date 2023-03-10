import React from 'react'
const MainMaster = React.lazy(() => import('../game/home/MainMaster'))
const JoinMaster = React.lazy(() => import('../game/home/JoinMaster'))
const CreateGameMaster = React.lazy(() =>
  import('../game/home/CreateGameMaster')
)
const FloatingModel = React.lazy(() => import('./FloatingModel'))
function GameMaster({ setIsPortal, pageI, setPageI }) {
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
