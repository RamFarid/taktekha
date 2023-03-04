import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { uid } from 'uid/secure'
import { useUser } from '../contexts/UserContext'
import { db } from '../firebase.config'

const INITIAL_STATE = {
  mode: '',
  board: Array(9).fill({ turn: '', move: null }),
  turn: '',
  status: {
    isEnded: false,
    endWith: '',
  },
}

const makeMove = (index, turn, array) => {
  const move = 9 - array.filter((el) => el.turn === '').length + 1
  const updatedBoard = array.map((el, i) => {
    if (i === index) {
      return { turn: turn, move: move }
    } else {
      return el
    }
  })
  return updatedBoard
}

const gameStateReducer = (state, action) => {
  switch (action.type) {
    case 'first_init':
      return {
        ...INITIAL_STATE,
        turn: action.payload.turn || 'x',
        mode: action.payload.mode,
      }
    case 'make_move':
      return {
        ...state,
        board: makeMove(action.payload, state.turn, state.board),
      }
    case 'change_game_turn':
      return {
        ...state,
        turn: state.turn === 'x' ? 'o' : 'x',
      }
    case 'game_end':
      return {
        ...state,
        status: {
          isEnded: true,
          endWith: action.payload,
        },
      }
    case 'own_turn':
      return {
        ...state,
        ownTurn: action.payload,
      }

    case 'drew_reset':
      return {
        ...INITIAL_STATE,
        mode: state.mode,
        turn: state.turn === 'x' ? 'o' : 'x',
      }
    case 'win_reset':
      return { ...INITIAL_STATE, turn: state.turn, mode: state.mode }
    default:
      return state
  }
}

const winnerCondition = (state) => {
  const row1 =
    state?.board[0].turn === state?.board[1].turn &&
    state?.board[1].turn === state?.board[2].turn &&
    state?.board[0].turn !== ''

  const row2 =
    state?.board[3].turn === state?.board[4].turn &&
    state?.board[4].turn === state?.board[5].turn &&
    state?.board[3].turn !== ''

  const row3 =
    state?.board[6].turn === state?.board[7].turn &&
    state?.board[7].turn === state?.board[8].turn &&
    state?.board[6].turn !== ''

  const column1 =
    state?.board[0].turn === state?.board[3].turn &&
    state?.board[3].turn === state?.board[6].turn &&
    state?.board[0].turn !== ''

  const column2 =
    state?.board[1].turn === state?.board[4].turn &&
    state?.board[4].turn === state?.board[7].turn &&
    state?.board[1].turn !== ''

  const column3 =
    state?.board[2].turn === state?.board[5].turn &&
    state?.board[5].turn === state?.board[8].turn &&
    state?.board[2].turn !== ''

  const diagonalSlash =
    state?.board[0].turn === state?.board[4].turn &&
    state?.board[4].turn === state?.board[8].turn &&
    state?.board[0].turn !== ''

  const diagonalBackSlash =
    state?.board[2].turn === state?.board[4].turn &&
    state?.board[4].turn === state?.board[6].turn &&
    state?.board[2].turn !== ''

  return (
    row1 ||
    row2 ||
    row3 ||
    column1 ||
    column2 ||
    column3 ||
    diagonalSlash ||
    diagonalBackSlash
  )
}

const changingLogic = (state, dispatch) => {
  const result = winnerCondition(state)
  if (result) {
    dispatch({ type: 'game_end', payload: 'win' })
  } else if (
    state.board.filter((v) => v.turn === '').length !== 9 &&
    state.board.filter((v) => v.turn === '').length !== 0
  ) {
    dispatch({ type: 'change_game_turn' })
  }
  if (state.board?.filter((val) => val.turn === '').length === 0 && !result) {
    dispatch({ type: 'game_end', payload: 'drew' })
  }
}

function useGame() {
  const [state, dispatch] = useReducer(gameStateReducer, INITIAL_STATE)
  useEffect(() => {
    changingLogic(state, dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.board])

  return [state, dispatch]
}

export const ONLINE_INITIAL_STATE = {
  id: '',
  mode: '',
  player1: ['', ''], // [PalyerUID, symbol]
  player2: ['', ''], // [PalyerUID, symbol]
  board: Array(9).fill({ turn: '', move: 0 }),
  turn: '',
  chat: [], // { msg: '', uid: '', time: '' }
  status: {
    isEnded: false,
    endWith: '',
  },
  reqsAgain: ['', '', ''], // [playerOneReq, playerTwoReq, roomID]
  time: undefined,
}

function useOnlineGame() {
  const navigateTo = useNavigate()
  const { user, gamesInProgress } = useUser()
  const [state, setState] = useState(ONLINE_INITIAL_STATE)

  const createLazyGame = () => {
    let isGameCreated = false
    gamesInProgress?.forEach((game) => {
      if (game.status.isEnded === false && game.player2[0].length === 0) {
        isGameCreated = true
      }
    })
    if (isGameCreated) {
      toast.error(
        'You already have a game created, use it by go to HOME => Games In progress => Created without uses',
        { autoClose: false, toastId: 'roomIsAlreadyCreated' }
      )
      return false
    }
    const id = uid(11)
    const newGameState = { ...ONLINE_INITIAL_STATE }
    newGameState.id = id
    newGameState.player1 = [user.uid, 'x']
    newGameState.mode = 'LAZY'
    newGameState.turn = user.uid
    newGameState.time = serverTimestamp()
    setDoc(doc(db, 'games', id), newGameState)
      .then(() => {
        navigateTo(`/board/${id}`)
        setState(newGameState)
      })
      .catch((error) => {
        toast.error(`Can't create your game ${error}`)
        console.log(error)
      })
  }

  const changingOnlineLogic = (state) => {
    const result = winnerCondition(state)
    if (result) {
      return {
        ...state,
        status: {
          isEnded: true,
          endWith: state.turn,
        },
      }
    } else if (
      state.board.filter((v) => v.turn === '').length !== 9 &&
      state.board.filter((v) => v.turn === '').length !== 0
    ) {
      return { ...state, turn: switchTurn() }
    }
    if (state.board?.filter((val) => val.turn === '').length === 0 && !result) {
      return {
        ...state,
        status: {
          isEnded: true,
          endWith: 'drew',
        },
      }
    }
  }

  const turnType = () => {
    let turnType
    if (state.player1[0] === user.uid) {
      turnType = state.player1[1]
    } else if (state.player2[0] === user.uid) {
      turnType = state.player2[1]
    }
    return turnType
  }

  const onlineMove = (index) => {
    const newArray = makeMove(index, turnType(), state.board)
    const newGameState = structuredClone(state)
    newGameState.board = newArray
    const gameWithNewLogic = changingOnlineLogic(newGameState)

    setDoc(doc(db, 'games', state.id), gameWithNewLogic).catch((error) => {
      toast.error("Can't send your turn")
      console.log(error)
    })
  }

  const turnStyleGenerator = () => {
    const symbol = turnType()
    if (state.turn === user.uid && !state.status.isEnded) {
      if (symbol === 'x') {
        return { color: 'var(--primary-color)' }
      } else if (symbol === 'o') {
        return { color: 'var(--light-strict)' }
      }
    }
    if (
      state.status.isEnded &&
      state.status.endWith === user.uid &&
      state.status.endWith !== 'drew'
    ) {
      if (symbol === 'x') {
        return { color: 'var(--primary-color)' }
      } else if (symbol === 'o') {
        return { color: 'var(--light-strict)' }
      }
    }
    if (
      state.status.isEnded &&
      state.status.endWith !== user.uid &&
      state.status.endWith !== 'drew'
    ) {
      if (symbol === 'x') {
        return { color: 'var(--light-strict)' }
      } else if (symbol === 'o') {
        return { color: 'var(--primary-color)' }
      }
    }
    if (state.turn !== user.uid && !state.status.isEnded) {
      if (symbol === 'x') {
        return { color: 'var(--light-strict)' }
      } else if (symbol === 'o') {
        return { color: 'var(--primary-color)' }
      }
    }
    return {}
  }

  const switchTurn = () => {
    if (state.turn === user.uid) {
      if (state.player1[0] === user.uid) {
        return state.player2[0]
      } else if (state.player2[0] === user.uid) {
        return state.player1[0]
      }
    } else {
      if (state.player1[0] === user.uid) {
        return state.player2[0]
      } else if (state.player2[0] === user.uid) {
        return state.player1[0]
      }
    }
  }

  const requestGame = () => {
    if (state.reqsAgain[0].length === 0) {
      const newGameState = structuredClone(state)
      newGameState.reqsAgain[0] = user.uid
      setDoc(doc(db, 'games', newGameState.id), newGameState)
    } else if (state.reqsAgain[1].length === 0) {
      const newGameState = structuredClone(state)
      newGameState.reqsAgain[1] = user.uid
      setDoc(doc(db, 'games', newGameState.id), newGameState)
    }
  }

  return {
    onlineGame: state,
    setOnlineGame: setState,
    turnStyleGenerator,
    onlineMove,
    createLazyGame,
    requestGame,
  }
}

export { useGame, useOnlineGame }
