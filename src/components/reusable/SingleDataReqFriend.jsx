import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import UserAccountInfo from '../Models/UserAccountInfo'
import Ripples from 'react-ripples'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase.config'
import { toast } from 'react-toastify'
import getDate from '../../getDate'
function SingleDataReqFriend({ uid }) {
  const {
    acceptFriend,
    isFromFriend,
    removeFriend,
    addFriend,
    isSentFriendReq,
    deniedFriend,
  } = useUser()
  const [accountData, setAccountData] = useState(false)
  const [currentFriend, setCurrentFriend] = useState({})
  useEffect(() => {
    const getUser = async () => {
      try {
        const docRef = doc(db, 'users', uid)
        const userDocRef = await getDoc(docRef)
        setCurrentFriend(userDocRef.data())
      } catch (error) {
        console.log(error)
        toast(error.message, {
          progress: false,
          autoClose: 2000,
        })
      }
    }
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <AnimatePresence key='singleDataFriend'>
      {Object.keys(currentFriend).length !== 0 ? (
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
              src={currentFriend?.photo}
              alt={currentFriend?.displayName}
              referrerPolicy='no-referrer'
            />
            <div>
              <div className='name'>{currentFriend?.displayName}</div>
              <div className='user-status sub-txt'>
                <span style={{ fontWeight: 900 }}>Sent on </span>
                {getDate(
                  isSentFriendReq(currentFriend.uid)?.data?.time?.seconds
                )}
              </div>
            </div>
          </div>
          <div>
            <Ripples
              className={
                isFromFriend(currentFriend?.uid)
                  ? 'btn-status remove'
                  : !isFromFriend(currentFriend?.uid) &&
                    isSentFriendReq(currentFriend?.uid)?.result
                  ? 'btn-status green-flag'
                  : 'btn-status'
              }
              onClick={() => {
                isFromFriend(currentFriend?.uid)
                  ? removeFriend(currentFriend?.uid)
                  : !isFromFriend(currentFriend?.uid) &&
                    isSentFriendReq(currentFriend?.uid)?.result
                  ? acceptFriend(currentFriend?.uid)
                  : addFriend(currentFriend?.uid)
              }}
            >
              {isFromFriend(currentFriend?.uid)
                ? 'Remove'
                : !isFromFriend(currentFriend?.uid) &&
                  isSentFriendReq(currentFriend?.uid)?.result
                ? 'Approve'
                : 'Add'}
            </Ripples>
            <Ripples>
              <button
                aria-label='Ignore friend request'
                className='strict-btn'
                onClick={() => deniedFriend(currentFriend?.uid)}
              >
                delete
              </button>
            </Ripples>
          </div>
          <AnimatePresence key={'singleDataFriendUserInfo'}>
            {accountData && (
              <UserAccountInfo
                setVisibility={setAccountData}
                friendDataFromUsersCollection={currentFriend}
              />
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div>Error occured while get request, please contact me</div>
      )}
    </AnimatePresence>
  )
}

export default SingleDataReqFriend
