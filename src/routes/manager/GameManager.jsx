import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useUser } from '../../contexts/UserContext'
import { db } from '../../firebase.config'
import Loader from '../../components/reusable/Loader'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'

function GameManager() {
  const navigate = useNavigate()
  const [game, setGame] = useState({})
  const [gamesBetween, setGamesBetween] = useState('unknown')
  const { id } = useParams()
  const { user, gamesInProgress } = useUser()
  useEffect(() => {
    const getData = async () => {
      const snapshot = await getDoc(doc(db, 'games', id)).catch((error) => {
        toast.error(`Error occured while get game ${error.message}`)
        navigate('/')
        console.error(error)
      })
      if (snapshot.exists()) {
        setGame(snapshot.data())
      } else {
        toast.info('No rooms available or room has been deleted')
        navigate('/')
        throw new Error(
          'No games available with this room or room has been deleted'
        )
      }

      const apiGamesBetween = await getDocs(
        query(collection(db, 'games'), where('status.isEnded', '==', false))
      )
      let result = 'unknown'
      if (apiGamesBetween.size !== 0) {
        apiGamesBetween.forEach((el) => {
          if (
            el.data().player1[0] === user.uid &&
            el.data().player2[0] === snapshot.data().player1[0]
          ) {
            result = 'true'
          } else if (
            el.data().player2[0] === user.uid &&
            el.data().player1[0] === snapshot.data().player1[0]
          ) {
            result = 'true'
          } else {
            result = 'false'
          }
        })
      } else if (apiGamesBetween.size === 0) {
        result = 'false'
      }
      setGamesBetween(result)
    }
    getData()
  }, [gamesInProgress, id, navigate, user.uid])
  const handleRetrivation = () => {
    if (Object.keys(game).length === 0 || gamesBetween === 'unknown') {
      return <Loader />
    } else if (Object.keys(game).length > 0 && gamesBetween !== 'unknown') {
      if (game?.player2[0] === user.uid || game?.player1[0] === user.uid) {
        return <Outlet />
      } else if (game?.player2[0].length === 0 && gamesBetween === 'true') {
        deleteDoc(doc(db, 'games', game.id)).then(() => {
          toast.error(
            "Can't enter room, Try again after finished the pending game with this friend",
            { autoClose: 7000 }
          )
        })
        return <Navigate to={'/'} />
      } else if (game?.player2[0].length === 0 && gamesBetween === 'false') {
        updateDoc(doc(db, 'games', id), {
          player2: [user.uid, 'o'],
        }).catch((error) => {
          toast.error("We can't comine you in the Game")
          navigate('/')
          console.error(error)
        })
        return <Outlet />
      } else {
        toast("You aren't able to enter the match.")
        return <Navigate to='/' />
      }
    }
  }
  return handleRetrivation()
}

export default GameManager
