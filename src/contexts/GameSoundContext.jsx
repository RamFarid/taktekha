import React, { useState, useContext, createContext } from 'react'

const GameSoundContext = createContext()

export function useGameSound() {
  return useContext(GameSoundContext)
}

function GameSoundContextProvider({ children }) {
  const [sound, setSound] = useState(true)
  return (
    <GameSoundContext.Provider value={{ sound, setSound }}>
      {children}
    </GameSoundContext.Provider>
  )
}

export default GameSoundContextProvider
