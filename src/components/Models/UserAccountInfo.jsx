import React from 'react'
import { useUser } from '../../contexts/UserContext'
import AccountInfo from '../game/home/AccountInfo'
import FloatingModel from './FloatingModel'
function UserAccountInfo({ setVisibility, friendDataFromUsersCollection }) {
  const { user } = useUser()
  const {
    isFromFriend,
    addFriend,
    removeFriend,
    isSentFriendReq,
    acceptFriend,
  } = useUser()
  const closeUser = (e) => {
    if (e.target.className === e.currentTarget.className) {
      setVisibility(false)
    }
  }
  return (
    <FloatingModel closePortal={closeUser} className={'user-data-wrapper'}>
      <AccountInfo
        userDataFromUsersCollection={friendDataFromUsersCollection}
      />
      {friendDataFromUsersCollection?.uid === user.uid ||
      !friendDataFromUsersCollection?.uid ? null : (
        <button
          aria-label='Control friend'
          className={
            isFromFriend(friendDataFromUsersCollection?.uid)
              ? 'user-btn strict-flag'
              : !isFromFriend(friendDataFromUsersCollection?.uid) &&
                isSentFriendReq(friendDataFromUsersCollection?.uid)?.result
              ? 'user-btn green-flag'
              : 'user-btn'
          }
          onClick={() => {
            setVisibility(false)
            isFromFriend(friendDataFromUsersCollection?.uid)
              ? removeFriend(friendDataFromUsersCollection?.uid)
              : !isFromFriend(friendDataFromUsersCollection?.uid) &&
                isSentFriendReq(friendDataFromUsersCollection?.uid)?.result
              ? acceptFriend(friendDataFromUsersCollection?.uid)
              : addFriend(friendDataFromUsersCollection?.uid)
          }}
        >
          {isFromFriend(friendDataFromUsersCollection?.uid)
            ? 'Remove'
            : !isFromFriend(friendDataFromUsersCollection?.uid) &&
              isSentFriendReq(friendDataFromUsersCollection?.uid)?.result
            ? 'Approve'
            : 'Add'}
        </button>
      )}
    </FloatingModel>
  )
}

export default UserAccountInfo
