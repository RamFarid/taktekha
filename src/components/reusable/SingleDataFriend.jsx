import React, { useEffect, useState } from 'react'
import Ripples from 'react-ripples'
import { AnimatePresence, motion } from 'framer-motion'
import UserAccountInfo from '../Models/UserAccountInfo'
import { useUser } from '../../contexts/UserContext'
import getDate from '../../getDate'
import FloatingModel from '../Models/FloatingModel'
import CreateGameMaster from '../game/home/CreateGameMaster'
import { GiCrossedSabres } from 'react-icons/gi'
import { BsFlag } from 'react-icons/bs'
import { off, onValue, ref } from 'firebase/database'
import { realtimedb } from '../../firebase.config'

function SingleDataFriend({ friendDataFromUsersCollection }) {
  const {
    isFromFriend,
    addFriend,
    acceptFriend,
    isSentFriendReq,
    friendSentList,
    isIsentGameReq,
    acceptInvite,
    isSentGameReq,
    deniedInvite,
    deniedFriend,
  } = useUser()
  const [accountData, setAccountData] = useState(false)
  const [createModal, setCreateModal] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const userRef = ref(
      realtimedb,
      `users/${friendDataFromUsersCollection.uid}`
    )
    const statusHandler = (snapshot) => {
      setStatus(snapshot.val().status)
    }
    onValue(userRef, (snapshot) => {
      setStatus(snapshot.val().status)
    })

    return () => {
      off(userRef, 'value', statusHandler)
    }
  }, [friendDataFromUsersCollection])

  const closeCreateModal = React.useCallback(() => {
    setCreateModal(false)
  }, [])

  const clickInvite = () => {
    setCreateModal(true)
  }

  const txtGnereator = (user) => {
    if (isIsentGameReq(user?.uid).result) {
      return 'Waiting..'
    }

    if (isSentGameReq(user?.uid)?.result) {
      return (
        <React.Fragment>
          Accept challenge <GiCrossedSabres />
        </React.Fragment>
      )
    }

    if (isSentFriendReq(user?.uid)?.result) {
      return 'Accept friend'
    }

    if (isFromFriend(user?.uid)) {
      return (
        <React.Fragment>
          Challenge <GiCrossedSabres />
        </React.Fragment>
      )
    }

    if (didISendReq(user?.uid)) {
      return 'Sent'
    }

    return 'Add friend'
  }

  const classNameGenerator = (user) => {
    if (isIsentGameReq(user?.uid).result || didISendReq(user?.uid)) {
      return 'btn-status disabled-flag avoid-pointer-events'
    }
    if (isSentGameReq(user?.uid).result || isSentFriendReq(user?.uid)?.result) {
      return 'btn-status green-flag'
    }
    return 'btn-status'
  }

  const clickHanlder = (user) => {
    if (isSentGameReq(user?.uid)?.result) {
      acceptInvite(user?.uid)
      return
    }
    if (isSentFriendReq(user?.uid)?.result) {
      acceptFriend(user?.uid)
      return
    }
    if (isFromFriend(user?.uid)) {
      clickInvite()
      return
    }
    addFriend(user?.uid)
  }

  const deniedHandler = (user) => {
    if (isSentGameReq(user?.uid)?.result) {
      deniedInvite(user?.uid)
      return
    }
    if (isSentFriendReq(user?.uid)?.result) {
      deniedFriend(user?.uid)
      return
    }
  }

  const deniedTxtGenerator = (user) => {
    if (isSentGameReq(user?.uid)?.result) {
      return (
        <React.Fragment>
          Denied <BsFlag />
        </React.Fragment>
      )
    }
    if (isSentFriendReq(user?.uid)?.result) {
      return 'Delete'
    }
  }

  const didISendReq = (uid) => {
    let result = false
    for (const reqSent of friendSentList) {
      if (reqSent.to === uid) {
        result = true
      }
    }
    return result
  }

  return (
    <AnimatePresence key='singleDataFriend'>
      <motion.div
        className='single-data friends'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        exit={{ scale: 0.6, opacity: 0 }}
      >
        <div
          className='left'
          onClick={() => {
            setAccountData(true)
          }}
        >
          <img
            src={friendDataFromUsersCollection?.photo}
            alt={friendDataFromUsersCollection?.displayName}
            referrerPolicy='no-referrer'
          />
          <div>
            <div className='name'>
              {friendDataFromUsersCollection?.displayName}
              <div className='user-status'>
                <span
                  className={
                    status === 'online'
                      ? 'user-status-symbol green-flag'
                      : status === 'playing'
                      ? 'user-status-symbol strict-flag'
                      : 'user-status-symbol disabled-flag'
                  }
                />
                <span className={`user-status-txt ${status}`}>{status}</span>
              </div>
            </div>
            <div className='user-status sub-txt'>
              {Object.keys(
                isSentFriendReq(friendDataFromUsersCollection?.uid)?.data
              )?.length === 0
                ? `Created on ${getDate(
                    friendDataFromUsersCollection?.time?.seconds
                  )}`
                : `Sent on ${getDate(
                    isSentFriendReq(friendDataFromUsersCollection?.uid)?.data
                      ?.time?.seconds
                  )}`}
            </div>
          </div>
        </div>
        <div>
          <Ripples
            className={classNameGenerator(friendDataFromUsersCollection)}
            onClick={() => clickHanlder(friendDataFromUsersCollection)}
          >
            {txtGnereator(friendDataFromUsersCollection)}
          </Ripples>
          {isSentGameReq(friendDataFromUsersCollection?.uid)?.result ||
          isSentFriendReq(friendDataFromUsersCollection?.uid)?.result ? (
            <Ripples>
              <button
                className='strict-btn'
                onClick={() => deniedHandler(friendDataFromUsersCollection)}
              >
                {deniedTxtGenerator(friendDataFromUsersCollection)}
              </button>
            </Ripples>
          ) : null}
        </div>
        <AnimatePresence key={'singleDataFriendUserInfo'}>
          {accountData && (
            <UserAccountInfo
              setVisibility={setAccountData}
              friendDataFromUsersCollection={friendDataFromUsersCollection}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence key={'createInInvite'}>
        {createModal && (
          <FloatingModel
            closePortal={closeCreateModal}
            className='invite-friends__page'
          >
            <CreateGameMaster
              changePageI={setCreateModal}
              friendToInvite={friendDataFromUsersCollection?.uid}
            />
          </FloatingModel>
        )}
      </AnimatePresence>
    </AnimatePresence>
  )
}

export default SingleDataFriend
