import { onAuthStateChanged } from 'firebase/auth'
import { BsEmojiSmileFill } from 'react-icons/bs'
import notificationSFX from '../assets/notification.mp3'
import { ONLINE_INITIAL_STATE } from '../GameProvider/index'
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { uid as uuid } from 'uid/secure'
import React, { createContext, useContext, useEffect, useState } from 'react'
import Loader from '../components/reusable/Loader'
import { Slide, toast } from 'react-toastify'
import { auth, db, realtimedb } from '../firebase.config'
import { getDateDiff } from '../getDate'
import { AiOutlineFieldTime } from 'react-icons/ai'
import { FiUserX } from 'react-icons/fi'
import { child, get, onDisconnect, ref } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { GiTurtleShell } from 'react-icons/gi'

const UserContext = createContext()

export const useUser = () => {
  return useContext(UserContext)
}

function UserContextProvider({ children }) {
  const [friendRequests, setFriendRequests] = useState([])
  const [userData, setUserData] = useState({})
  const [friendSentList, setFriendSentList] = useState([])
  const [friendsList, setFriendsList] = useState([])
  const [gamesHistory, setGamesHistory] = useState([])
  const [gamesInProgress, setGamesInProgress] = useState([])
  const [sentGameReqs, setSentGameReqs] = useState([])
  const [receivegameReqs, setReceivegameReqs] = useState([])
  const [user, setUser] = useState(auth.currentUser)
  // const [isWaitingGames, setIsWaitingGames] = useState(true)
  // const [userCache, setUserCache] = useState([])
  const [isWaitingUser, setIsWaitingUser] = useState(true)
  const navigateTo = useNavigate()

  const getFriendList = (friendsListL) => {
    if (friendsListL.length === 0) {
      setFriendsList([])
      return
    }
    if (friendsList.length > friendsListL.length) {
      const currentFriendsUids = friendsList.map((el) => el.uid)
      let usersToDelete = currentFriendsUids.filter(
        (uid) => !currentFriendsUids.includes(uid)
      )
      if (usersToDelete.length === 0) {
        setFriendsList([])
      } else {
        usersToDelete.forEach((friendToRemove) => {
          const newArrayOfFriends = friendsList.filter((friend) => {
            return friend.uid === friendToRemove
          })
          setFriendsList(newArrayOfFriends)
        })
      }
      return
    }
    let usersToGet = []
    // Add user
    if (friendsList.length < friendsListL.length) {
      const currentUids = friendsList.map((el) => el.uid)
      usersToGet = friendsListL.filter((uid) => !currentUids.includes(uid))

      const promisesArray = usersToGet.map((id) => {
        return getDoc(doc(db, 'users', id))
      })
      Promise.all(promisesArray)
        .then((data) => {
          data.forEach((friend) => {
            setFriendsList((preList) => [...preList, friend.data()])
          })
        })
        .catch((err) => {
          toast.error(err.message)
          console.log(err)
        })
    }
  }

  useEffect(() => {
    const reArrangeFriends = () => {
      if (friendsList.length > 1 && receivegameReqs.length) {
        // Friends sent a game request
        const reqs = receivegameReqs.map((game) => game.from)
        // Get friend reqs from array
        const friendsSentReqs = friendsList.filter((friend) =>
          reqs.includes(friend.uid)
        )
        // Delete friends that req array
        const clearlyFriendsArray = friendsList.filter(
          (friend) => !reqs.includes(friend.uid)
        )
        const updatedFriendsList = friendsSentReqs.concat(clearlyFriendsArray)
        if (JSON.stringify(updatedFriendsList) === JSON.stringify(friendsList))
          return

        setFriendsList(updatedFriendsList)
      }
    }
    reArrangeFriends()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivegameReqs, friendsList])

  useEffect(() => {
    if (Object.keys(userData).length !== 0) getFriendList(userData.friendsList)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  useEffect(() => {
    let deleteListenerForFriendReqsChange
    let deleteListenerForUserDataChange
    let deleteListenerForSentChange
    let deleteListenerForSentGameReqs
    let deleteListenerForRecieveGameReqs
    let dissconnect
    if (user?.uid && navigator.onLine) {
      const userStatusRef = ref(realtimedb, `users/${user.uid}/status`)
      dissconnect = onDisconnect(userStatusRef)
      dissconnect.set('offline')

      deleteListenerForRecieveGameReqs = onSnapshot(
        query(collection(db, 'gameReqs'), where('to', '==', user.uid)),
        (querySnapshot) => {
          const data = []
          if (querySnapshot.size) {
            querySnapshot.forEach((docData) => {
              const date = getDateDiff(docData.data().time.seconds * 1000)
              if (date.days || date.hours || date.minutes > 4) {
                deleteDoc(docData.ref).catch((err) => console.log(err))
              } else if (
                docData.data().status !== 'denied' &&
                docData.data().status !== 'approved'
              ) {
                data.push(docData.data())
                const [friend] = friendsList.filter(
                  (f) => f.uid === docData.data().from
                )
                if (friend) {
                  toast(
                    `${friend?.displayName} challenged you in ${
                      docData.data().mode
                    } game`,
                    {
                      icon:
                        docData.data().mode.toLowerCase() === 'lazy' ? (
                          <GiTurtleShell fill='#718b5a' />
                        ) : null,
                    }
                  )
                } else {
                  getDoc(doc(db, 'users', docData.data().from)).then(
                    (apiFriend) => {
                      toast(
                        `${apiFriend.data()?.displayName} challenged you in ${
                          docData.data().mode
                        } game`,
                        {
                          icon:
                            docData.data().mode.toLowerCase() === 'lazy' ? (
                              <GiTurtleShell fill='#718b5a' />
                            ) : null,
                        }
                      )
                    }
                  )
                }
              }
            })
          }
          setReceivegameReqs(data)
        },
        (er) =>
          toast.error(
            `Something went wront while get your friend requests ${er}`
          )
      )

      deleteListenerForSentGameReqs = onSnapshot(
        query(collection(db, 'gameReqs'), where('from', '==', user.uid)),
        (querySnapshot) => {
          const data = []
          if (querySnapshot.size) {
            querySnapshot.forEach((eachDoc) => {
              const docData = eachDoc?.data()
              const date = getDateDiff(docData?.time?.seconds * 1000)
              if (docData.status === 'denied') {
                // Review denied
                deniedAction(docData)
              } else if (docData.status === 'approved') {
                // Review approved
                approvedAction(docData)
              } else if (date.days || date.hours || date.minutes > 3) {
                // Review Time
                console.log('Date is terminate: ')
                deleteDoc(eachDoc.ref).catch((err) => console.log(err))
              } else {
                // The request is pending
                data.push(docData)
              }
            })
          }
          setSentGameReqs(data)
        },
        (er) =>
          toast.error(
            `Something went wront while get your friend requests ${er}`
          )
      )

      // My friends Sent Change
      deleteListenerForSentChange = onSnapshot(
        query(collection(db, 'friendReqs'), where('from', '==', user.uid)),
        (querySnapshot) => {
          const requests = []
          if (querySnapshot.size) {
            querySnapshot.forEach((doc) => {
              requests.push(doc.data())
            })
          }
          setFriendSentList(requests)
        },
        (er) =>
          toast.error(
            `Something went wront while get your friend requests ${er}`
          )
      )

      // UserDataChange
      deleteListenerForUserDataChange = onSnapshot(
        doc(db, 'users', user.uid),
        (doc) => {
          if (doc.exists()) {
            setUserData(doc.data())
          }
        }
      )

      // Friends Reqs Change
      deleteListenerForFriendReqsChange = onSnapshot(
        query(collection(db, 'friendReqs'), where('to', '==', user.uid)),
        (querySnapshot) => {
          const requests = []
          if (querySnapshot.size) {
            querySnapshot.forEach((doc) => {
              new Audio(notificationSFX).play()
              requests.push(doc.data())
            })
          }
          setFriendRequests(requests)
        },
        (er) =>
          toast.error(
            `Something went wront while get your friend requests ${er}`
          )
      )
    }
    if (!navigator.onLine && user?.uid) {
      getDocs(
        query(collection(db, 'friendReqs'), where('to', '==', user.uid))
      ).then((querySnapshot) => {
        const requests = []
        if (querySnapshot.size) {
          querySnapshot.forEach((doc) => {
            new Audio(notificationSFX).play()
            requests.push(doc.data())
          })
        }
        setFriendRequests(requests)
      })
      getDoc(doc(db, 'users', user.uid)).then((doc) => {
        if (doc.exists()) {
          setUserData(doc.data())
        }
      })
    }

    return () => {
      if (user?.uid) {
        deleteListenerForSentChange()
        deleteListenerForUserDataChange()
        deleteListenerForRecieveGameReqs()
        deleteListenerForFriendReqsChange()
        deleteListenerForSentGameReqs()
        dissconnect.cancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid])

  useEffect(() => {
    const deleteListener = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsWaitingUser(false)
      console.log(user)
    })
    return () => {
      deleteListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const deniedAction = async (docData) => {
    const [friend] = friendsList.filter((friend) => friend.uid === docData.to)
    if (friend) {
      toast.error(`${friend?.displayName} can't play right now`, {
        hideProgressBar: true,
        transition: Slide,
      })
    } else {
      const apiFriend = await getDoc(doc(db, 'users', docData.to)).catch(
        (err) => console.log(err)
      )
      toast.error(`${apiFriend.data().displayName} can't play right now`, {
        hideProgressBar: true,
        transition: Slide,
      })
    }
    await deleteDoc(doc(db, 'gameReqs', docData.id)).catch((err) =>
      console.log(err)
    )
  }

  const approvedAction = async (docData) => {
    await deleteDoc(doc(db, 'gameReqs', docData.id)).catch((err) =>
      console.log(err)
    )
    navigateTo(`/board/${docData.roomId}`)
  }

  const isGameBetween = (uid) => {
    const isGameBetweenUs = gamesInProgress.filter((game) => {
      if (game.player1[0] === uid && game.player2[0] === user.uid) {
        return game
      }
      if (game.player2[0] === uid && game.player1[0] === user.uid) {
        return game
      }
      return null
    })
    return isGameBetweenUs
  }

  const inviteFriend = async (uid, mode = 'LAZY') => {
    // Check if user is offline or online or playing
    const userStatus = await get(child(ref(realtimedb), `users/${uid}`))
    if (userStatus.exists()) {
      if (userStatus.val().status === 'offline') {
        toast.error("Can't challenge friend, beacuese he's currently offline", {
          autoClose: 6000,
        })
        throw new Error('offline user')
      }
      if (userStatus.val().status === 'playing') {
        toast.error("Can't challenge friend, beacuese he's currently in game", {
          autoClose: 6000,
        })
        throw new Error('user already in Game user')
      }
    }
    // If there is game in progress between the two users
    const gamesBetweenUs = isGameBetween(uid)
    if (gamesBetweenUs.length > 0) {
      toast.error(
        "Can't challenge friend, Try again after finished the pending game with this friend",
        { autoClose: 7000 }
      )
      throw new Error('pending game')
    }
    const { result } = isSentGameReq(uid)
    if (result) throw new Error('User already sent game request!')
    const id = uuid()
    setDoc(doc(db, 'gameReqs', id), {
      time: serverTimestamp(),
      from: user.uid,
      to: uid,
      status: 'pending',
      mode: mode,
      roomId: '',
      id,
    }).catch((error) => {
      toast.error(`Something went wrong ${error}`)
      console.log(error)
    })
  }

  const isFromFriend = (uid) => {
    let result = false
    for (const friend of userData.friendsList) {
      if (friend === uid) {
        result = true
      }
    }
    return result
  }

  // const displayError = (code) => {
  //   switch (code) {
  //     case 'auth/popup-closed-by-user':
  //       console.log('The sign in paused')
  //       break
  //     default:
  //       return
  //   }
  // }

  const addFriend = (uid) => {
    // Check if is already sent
    for (const result of friendSentList) {
      if (result.from === user.uid && result.to === uid) {
        toast('You have already sent request', { type: 'info' })
        return
      }
    }
    addDoc(collection(db, 'friendReqs'), {
      to: uid,
      from: user.uid,
      time: serverTimestamp(),
    })
      .then((docRef) => {
        toast.success('Sent friend request', docRef.id)
      })
      .catch((error) => toast(error.message, { type: 'error' }))
  }

  const removeFriend = async (uid) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        friendsList: arrayRemove(user.uid),
      })
      await updateDoc(doc(db, 'users', user.uid), {
        friendsList: arrayRemove(uid),
      })
    } catch (error) {
      toast.error(`Can't remove friend ${error}`)
    }
  }

  const acceptFriend = async (uid) => {
    // Accept friend:
    // - Remove user req from friendReqs collection
    // - Add user to both friends list
    try {
      //2=> Remove user req from friendReqs collection
      // Get document
      const q = query(
        collection(db, 'friendReqs'),
        where('to', '==', user.uid),
        where('from', '==', uid)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        // Remove it
        deleteDoc(doc.ref).catch((err) => toast.error(err))
      })
      //3=> Add user to both friends list
      updateDoc(doc(db, 'users', user.uid), {
        friendsList: arrayUnion(uid),
      }).catch((err) => toast.error(err))
      updateDoc(doc(db, 'users', uid), {
        friendsList: arrayUnion(user.uid),
      }).catch((err) => toast.error(err))
      toast.success('You are now Friends!', { icon: <BsEmojiSmileFill /> })
    } catch (error) {
      toast.error(error.message)
    }
  }

  const isSentFriendReq = (uid) => {
    if (!uid) return
    let result = false
    let data = {}
    for (const req of friendRequests) {
      if (req.from === uid) {
        result = true
        data = req
      }
    }
    return { result, data }
  }

  const isIsentGameReq = (uid) => {
    if (!uid) return
    let result = false
    let data = {}
    for (const req of sentGameReqs) {
      if (req.to === uid) {
        result = true
        data = req
      }
    }
    return { result, data }
  }

  const isSentGameReq = (uid) => {
    if (!uid) return
    let result = false
    let data = {}
    for (const req of receivegameReqs) {
      if (req.from === uid) {
        result = true
        data = req
      }
    }
    return { result, data }
  }

  const acceptInvite = async (uid) => {
    console.log('Accept challenge')
    //  get request
    const { result, data } = isSentGameReq(uid)
    // If no request.
    if (!result) return toast.error('Request terminate')
    // Check if time terminate
    const date = getDateDiff(data?.time?.seconds * 1000)
    if (date.days || date.hours || date.minutes > 3) {
      toast('Challenge expired', { icon: <AiOutlineFieldTime /> })
      deleteDoc(doc(db, 'gameReqs', data.id)).catch((err) => console.log(err))
      throw new Error()
    }
    // Check if there are friends
    const isFriend = isFromFriend(uid)
    if (!isFriend) {
      toast.info(
        "Sorry, you can't play with him because you are no longer friends, Create room and play together",
        { icon: <FiUserX /> }
      )
      deleteDoc(doc(db, 'gameReqs', data.id)).catch((err) => console.log(err))
      throw new Error()
    }
    // Check if other user in another game / Check is user offline
    const userStatus = await get(child(ref(realtimedb), `users/${uid}`))
    if (userStatus.exists()) {
      if (userStatus.val().status === 'offline') {
        toast.error("Friend can't play right now, beacuese he's Offline")
        deleteDoc(doc(db, 'gameReqs', data.id)).catch((err) => console.log(err))
        throw new Error('User offline')
      }
      if (userStatus.val().status === 'playing') {
        toast.error(
          "Friend can't play right now, beacuese he's currently in game"
        )
        deleteDoc(doc(db, 'gameReqs', data.id)).catch((err) => console.log(err))
        throw new Error('User playing')
      }
    }
    // End: Accept invitation
    const id = uuid(11)
    updateDoc(doc(db, 'gameReqs', data.id), {
      status: 'approved',
      roomId: id,
    })
      .then(() => {
        const newGameState = structuredClone(ONLINE_INITIAL_STATE)
        newGameState.id = id
        newGameState.mode = 'LAZY'
        newGameState.player1 = [data.from, 'x']
        newGameState.turn = data.from
        newGameState.player2 = [user.uid, 'o']
        newGameState.time = serverTimestamp()
        setDoc(doc(db, 'games', id), newGameState)
          .then(() => {
            navigateTo(`/board/${id}`)
          })
          .catch((error) => {
            toast.error(`Can't create your game ${error}`)
            console.log(error)
          })
      })
      .catch((err) => console.log(err))
  }

  const deniedFriend = (uid) => {
    const { result } = isSentFriendReq(uid)
    if (!result) return toast('There is no friend request sent by this user')
    getDocs(
      query(
        collection(db, 'friendReqs'),
        where('to', '==', user.uid),
        where('from', '==', uid)
      )
    ).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Remove it
        deleteDoc(doc.ref).catch((err) => toast.error(err.message))
      })
    })
  }

  const refreshFriends = async () => {
    try {
      if (friendsList.length === 0) return
      const currentUids = friendsList.map((el) => el.uid)
      const promisesArray = currentUids.map((id) => {
        return getDoc(doc(db, 'users', id))
      })
      await Promise.all(promisesArray)
        .then((data) => {
          const updatedFriends = []
          data.forEach((friend) => {
            updatedFriends.push(friend.data())
          })
          setFriendsList(updatedFriends)
        })
        .catch((err) => {
          toast.error(err.message)
          console.log(err)
        })
    } catch (error) {
      console.log(error)
    }
  }

  const deniedInvite = (uid) => {
    //  get request
    const { result, data } = isSentGameReq(uid)
    // If no request.
    if (!result) return toast.error('Request terminate')
    // Check if time terminate
    const date = getDateDiff(data?.time?.seconds * 1000)
    if (date.days || date.hours || date.minutes > 3) {
      toast('Challenge expired', { icon: <AiOutlineFieldTime /> })
      deleteDoc(doc(db, 'gameReqs', data.id)).catch((err) => console.log(err))
      return
    }
    // Check if there are friends
    const isFriend = isFromFriend(uid)
    if (!isFriend) {
      toast.info('Room terminated because you are no longer friends', {
        icon: <FiUserX />,
      })
      deleteDoc(doc(db, 'gameReqs', data.id)).catch((err) => console.log(err))
      return
    }

    // End: denied req
    updateDoc(doc(db, 'gameReqs', data.id), {
      status: 'denied',
    }).catch((err) => console.log(err))
  }

  return (
    <UserContext.Provider
      value={{
        user,
        // displayError,
        userData,
        friendSentList,
        friendRequests,
        setUserData,
        isFromFriend,
        addFriend,
        removeFriend,
        acceptFriend,
        isSentFriendReq,
        gamesHistory,
        gamesInProgress,
        setGamesHistory,
        setGamesInProgress,
        friendsList,
        inviteFriend,
        isIsentGameReq,
        isSentGameReq,
        acceptInvite,
        deniedInvite,
        deniedFriend,
        setFriendsList,
        refreshFriends,
        isGameBetween,
      }}
    >
      {isWaitingUser ? <Loader /> : children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
