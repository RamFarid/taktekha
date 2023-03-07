import { ref, set } from 'firebase/database'
import {
  collection,
  deleteDoc,
  doc as docRef,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'
import { db, realtimedb } from '../firebase.config'
import { ONLINE_INITIAL_STATE } from '../GameProvider'
import { useGameData } from './GameContext'
import { useUser } from './UserContext'

function GamesHistoriesContextProvider({ children }) {
  const { user, setGamesHistory, setGamesInProgress, userData } = useUser()
  const { setOnlineGame } = useGameData()
  useEffect(() => {
    set(ref(realtimedb, `users/${user.uid}/status`), 'online')
    setOnlineGame(ONLINE_INITIAL_STATE)
    const getGames = async () => {
      try {
        const data1 = await getDocs(
          query(
            collection(db, 'games'),
            where('player1', 'array-contains', user.uid)
          )
        )
        const data2 = await getDocs(
          query(
            collection(db, 'games'),
            where('player2', 'array-contains', user.uid)
          )
        )
        return { data1, data2 }
      } catch (error) {
        console.log(error)
        toast.error(`Failed get your games history: ${error}`)
      }
    }
    if (user.uid && Object.keys(userData).length !== 0) {
      // Get Games History
      getGames()
        // Separate two data in two arrays (History/In progress)
        .then(({ data1, data2 }) => {
          let gamesHistory = []
          let gamesInProgress = []
          if (data1.size > 0) {
            data1.forEach((doc) => {
              if (doc.data().player1[0] === doc.data().player2[0]) {
                deleteDoc(docRef(db, 'games', doc.data().id))
              } else if (doc.data().status.isEnded === false) {
                gamesInProgress.push(doc.data())
              } else if (doc.data().status.isEnded === true) {
                gamesHistory.push(doc.data())
              }
            })
          }
          if (data2.size > 0) {
            data2.forEach((doc) => {
              if (doc.data().player1[0] === doc.data().player2[0]) {
                deleteDoc(docRef(db, 'games', doc.data().id))
              } else if (doc.data().status.isEnded === false) {
                gamesInProgress.push(doc.data())
              } else if (doc.data().status.isEnded === true) {
                gamesHistory.push(doc.data())
              }
            })
          }
          setGamesInProgress(gamesInProgress)
          setGamesHistory(gamesHistory)
          return { gamesHistory, gamesInProgress }
        })
        // Rearrange games from newst to older
        .then(({ gamesHistory, gamesInProgress }) => {
          gamesHistory.sort((a, b) => {
            return b.time.seconds - a.time.seconds
          })
          return gamesHistory
        })
        // Change game scores
        .then((gamesHistory) => {
          let serverGames = [0, 0, 0]
          gamesHistory.forEach((game) => {
            if (game.status.endWith === user.uid) {
              serverGames[0] += 1
            } else if (game.status.endWith === 'drew') {
              serverGames[2] += 1
            } else if (
              game.status.endWith !== user.uid &&
              game.status.endWith.length > 0
            ) {
              serverGames[1] += 1
            }
          })
          if (JSON.stringify(serverGames) !== JSON.stringify(userData.games)) {
            updateDoc(docRef(db, 'users', user.uid), {
              games: serverGames,
            }).then(() => {
              console.log('Update game score succssefully')
            })
          }
        })
        .catch((error) => {
          toast.error('Failed get your games history')
          console.log(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, userData])
  return <React.Fragment>{children}</React.Fragment>
}

export default GamesHistoriesContextProvider
