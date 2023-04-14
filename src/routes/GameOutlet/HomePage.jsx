import React from 'react'
import AccountData from '../../components/game/home/AccountData'
import AccountInfo from '../../components/game/home/AccountInfo'
import GameMasterBtn from '../../components/game/home/GameMasterBtn'
import { useUser } from '../../contexts/UserContext'

import '../../Styles/home.css'
import usePageTitle from '../../hooks/usePageTitle'
import PullToRefresh from 'react-simple-pull-to-refresh'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../firebase.config'
import { toast } from 'react-toastify'
function HomePage() {
  const { userData, user, setUserData, setGamesInProgress, setGamesHistory } =
    useUser()

  usePageTitle('Taktekha | Home')

  const homeRefresh = async () => {
    const myData = await getDoc(doc(db, 'users', user.uid))
    setUserData(myData.data())
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
      } catch (error) {}
    }
    if (user.uid && Object.keys(userData).length !== 0) {
      // Get Games History
      await getGames()
        // Separate two data in two arrays (History/In progress)
        .then(({ data1, data2 }) => {
          let gamesHistory = []
          let gamesInProgress = []
          if (data1.size > 0) {
            data1.forEach((doc) => {
              if (doc.data().status.isEnded === false) {
                gamesInProgress.push(doc.data())
              } else if (doc.data().status.isEnded === true) {
                gamesHistory.push(doc.data())
              }
            })
          }
          if (data2.size > 0) {
            data2.forEach((doc) => {
              if (doc.data().status.isEnded === false) {
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
        .then(({ gamesHistory }) => {
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
            console.log('Server games not equal')
            updateDoc(doc(db, 'users', user.uid), {
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
  }

  return (
    <PullToRefresh onRefresh={homeRefresh}>
      <section className='HOME__PAGE'>
        <AccountInfo
          userDataFromUsersCollection={
            Object.keys(userData).length >= 1 && userData
          }
        />
        <AccountData />
        <GameMasterBtn />
      </section>
    </PullToRefresh>
  )
}

export default HomePage
