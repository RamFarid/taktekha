import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useUser } from '../../contexts/UserContext'
import { db } from '../../firebase.config'
import getDate from '../../getDate'
// import Ripples from 'react-ripples'
function SingleDataGame({ data, pauseFetch, outCo }) {
  const { user, friendsList } = useUser()
  const [friendData, setFriendData] = useState({})
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUser = () => {
      let friendUid
      if (data.player1[0] === user.uid) {
        friendUid = data.player2[0]
      } else if (data.player2[0]) {
        friendUid = data.player1[0]
      }
      let friend = friendsList.find((data) => data.uid === friendUid)
      if (!friend) {
        getDoc(doc(db, 'users', friendUid)).then((snapShot) => {
          if (snapShot.exists()) {
            setFriendData(snapShot.data())
          } else {
            toast.error(`No user in this game. ${data.id}`)
          }
        })
      } else {
        setFriendData(friend)
      }
    }
    if (!pauseFetch && data.player2[0].length > 0) {
      fetchUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseFetch])

  const openGameHistory = () => {
    if (outCo) return
    navigate(`/board/${data.id}`)
  }

  return (
    <div
      className={
        Object.keys(friendData).length === 0 && data?.status?.isEnded === true
          ? 'single-data strict-flag'
          : 'single-data'
      }
      onClick={openGameHistory}
    >
      <div className='left'>
        <div
          className='name'
          style={{
            color:
              data?.status?.endWith === user.uid
                ? 'var(--light-green)'
                : data?.status?.endWith === 'drew' ||
                  data.status.isEnded === false ||
                  data.player2[0].length === 0
                ? 'var(--disable-color)'
                : 'var(--light-strict)',
          }}
        >
          {data?.status?.isEnded === false && data?.player2[0]?.length === 0
            ? 'Created without uses'
            : Object.keys(friendData).length > 0
            ? friendData?.displayName
            : 'Contact us to solve this problem'}
        </div>
        <div className='date sub-txt'>{getDate(data?.time?.seconds)}</div>
      </div>
      <div
        className='status'
        style={{
          color:
            data?.status?.endWith === user.uid
              ? 'var(--light-green)'
              : data?.status?.endWith === 'drew' ||
                data.status.isEnded === false ||
                data.player2[0].length === 0
              ? 'var(--disable-color)'
              : 'var(--light-strict)',
        }}
      >
        {data?.status?.endWith === user.uid
          ? 'WON'
          : data?.status?.endWith === 'drew'
          ? 'TIE'
          : data.status.isEnded === false || data.player2[0].length === 0
          ? 'In progress'
          : 'LOSE'}
      </div>
    </div>
  )
}
// 'var(--light-green)'
// 'var(--light-strict)'
// 'var(--disable-color)'
export default SingleDataGame
