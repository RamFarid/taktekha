// import { onDisconnect } from 'firebase/database'
import React, { createContext, useContext } from 'react'
import { useGame, useOnlineGame } from '../GameProvider'
// import { realtimedb } from '../firebase.config'

const GameContext = createContext()

export function useGameData() {
  return useContext(GameContext)
}

function GameContextProvider({ children }) {
  const [state, dispatch] = useGame()
  const {
    onlineGame,
    setOnlineGame,
    requestGame,
    turnStyleGenerator,
    onlineMove,
    createLazyGame,
  } = useOnlineGame()
  // const [boardPast, setBoardPast] = useState(Array(9).fill({ move: null, turn: '' }))

  return (
    <GameContext.Provider
      value={{
        gameState: state,
        dispatch,
        onlineGame,
        setOnlineGame,
        turnStyleGenerator,
        onlineMove,
        createLazyGame,
        requestGame,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export default GameContextProvider
