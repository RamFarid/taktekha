import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UserBoard from '../../components/game/board/UserBoard'
import UserOptions from '../../components/game/board/UserOptions'
import { useGameData } from '../../contexts/GameContext'
import HomeBtn from '../../components/game/board/HomeBtn'
import { db, realtimedb } from '../../firebase.config'

// import msgNotification from '../../assets/click.wav'
import '../../Styles/board.css'
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useUser } from '../../contexts/UserContext'
import { ref, set } from 'firebase/database'
import { uid } from 'uid/secure'
import { ONLINE_INITIAL_STATE } from '../../GameProvider'
import Loader from '../../components/reusable/Loader'
import GameStatus from '../../components/game/board/GameStatus'
import MainOnlineBoard from '../../components/game/board/MainOnlineBoard'

const EndBtn = React.lazy(() => import('../../components/game/board/EndBtn'))
const FloatingModel = React.lazy(() =>
  import('../../components/Models/FloatingModel')
)
const PlayAgain = React.lazy(() => import('../../components/Models/PlayAgain'))
const Share = React.lazy(() => import('../../components/Models/Share'))
const Chat = React.lazy(() => import('../../components/Models/Chat'))

// const notification = new Audio(msgNotification)

function OnlineBoard() {
  const { id } = useParams()
  const navigateTo = useNavigate()
  const { user, userData, friendsList } = useUser()
  const { onlineGame, requestGame, setOnlineGame } = useGameData()
  const [chatAppear, setChatAppear] = useState(false)
  const [seen, setSeen] = useState(true)
  const [anotherFriend, setAnotherFriend] = useState({})
  const [isLivePlay, setIsLivePlay] = useState(false)

  useEffect(() => {
    toast.dismiss()
    const getAnotherFriend = (data) => {
      if (Object.keys(anotherFriend).length > 0 || data.player2[0].length === 0)
        return
      let friendUid
      if (data.player1[0] === user.uid) {
        friendUid = data.player2[0]
      } else if (data.player2[0]) {
        friendUid = data.player1[0]
      }
      let friend = friendsList.find((eFriend) => eFriend.uid === friendUid)
      if (!friend) {
        getDoc(doc(db, 'users', friendUid))
          .then((data) => {
            setAnotherFriend(data.data())
          })
          .catch((error) => {
            console.log(error)
            toast(error.message, {
              progress: false,
              autoClose: 2000,
            })
          })
      } else {
        setAnotherFriend(friend)
      }
    }
    const deleteListenerForGameRef = onSnapshot(
      doc(db, `games`, id),
      (querySnapshot) => {
        if (querySnapshot.exists()) {
          if (querySnapshot.data().status.isEnded === false) {
            set(ref(realtimedb, `users/${user.uid}/status`), 'playing')
            setIsLivePlay(true)
            console.log(querySnapshot.data())
          }
          setOnlineGame(querySnapshot.data())
          getAnotherFriend(querySnapshot.data())
        } else {
          toast.error('Room has been deleted')
          navigateTo('/')
        }
      }
    )

    return () => {
      deleteListenerForGameRef()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    const oneMoreAction = () => {
      if (
        onlineGame?.reqsAgain[0].length !== 0 &&
        onlineGame?.reqsAgain[1].length !== 0 &&
        onlineGame?.reqsAgain[2].length !== 0 &&
        isLivePlay
      ) {
        navigateTo(`/board/${onlineGame.reqsAgain[2]}`)
      }
    }
    oneMoreAction()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineGame.reqsAgain])

  const refuseReqAagin = React.useCallback(() => {
    setIsLivePlay(false)
  }, [])

  const acceptReqAgain = async () => {
    const id = uid(11)
    const newGameState = structuredClone(ONLINE_INITIAL_STATE)
    newGameState.id = id
    newGameState.player1 = [user.uid, 'x']
    newGameState.player2 = [onlineGame.reqsAgain[0], 'o']
    newGameState.mode = 'LAZY'
    newGameState.turn = user.uid
    newGameState.time = serverTimestamp()
    setDoc(doc(db, 'games', id), newGameState)
      .then(() => {
        setOnlineGame(newGameState)
        navigateTo(`/board/${id}`)
        const currentGame = structuredClone(onlineGame)
        currentGame.reqsAgain[1] = user.uid
        currentGame.reqsAgain[2] = id
        setDoc(doc(db, 'games', onlineGame.id), currentGame)
      })
      .catch((error) => {
        toast.error(`Can't create your game or make req order with: ${error}`)
        console.log(error)
      })
  }

  return (
    <section className='game-board'>
      {isLivePlay && onlineGame.reqsAgain[0] === user.uid ? <Loader /> : null}
      {onlineGame.status.isEnded &&
      onlineGame.reqsAgain[0].length !== 0 &&
      onlineGame.reqsAgain[0] !== user.uid &&
      isLivePlay ? (
        <FloatingModel className={'another-game'}>
          <PlayAgain
            acceptReqAgain={acceptReqAgain}
            anotherFriend={anotherFriend}
            refuseReqAagin={refuseReqAagin}
          />
        </FloatingModel>
      ) : null}
      <HomeBtn />
      <UserBoard user={anotherFriend} />
      <GameStatus anotherFriend={anotherFriend} />
      <MainOnlineBoard />
      <AnimatePresence key={'endButton'}>
        {onlineGame.status.isEnded &&
        isLivePlay &&
        onlineGame.reqsAgain[0] !== user.uid ? (
          <EndBtn onClick={requestGame} />
        ) : null}
      </AnimatePresence>
      <UserOptions
        seen={seen}
        chatHandler={() => {
          setChatAppear(true)
        }}
      />
      <UserBoard user={userData} />
      {onlineGame?.player1[0]?.length === 0 ||
      onlineGame?.player2[0]?.length === 0 ? (
        <Share />
      ) : null}
      <AnimatePresence key={'chatModal'}>
        {chatAppear ? (
          <Chat setChatAppear={setChatAppear} seen={seen} setSeen={setSeen} />
        ) : null}
      </AnimatePresence>
    </section>
  )
}

export default OnlineBoard

// useEffect(() => {
//   if (!onlineGame.status.isEnded) {
//     if (onlineGame?.chat[onlineGame?.chat?.length - 1]?.uid !== user?.uid) {
//       notification.play()
//       // setSeen(false)
//     }
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, [onlineGame.chat])
