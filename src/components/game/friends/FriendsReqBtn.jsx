import React, { useState } from 'react'
import { AiOutlineUserSwitch } from 'react-icons/ai'
import FriendsNotification from '../../reusable/FriendsNotification'
import { useUser } from '../../../contexts/UserContext'

const FriendsRequestPage = React.lazy(() =>
  import('../../Models/FriendsRequestPage')
)
function FriendsReqBtn() {
  const { friendRequests } = useUser()
  const [reqPage, setReqPage] = useState(false)
  return (
    <React.Fragment>
      <div className='friend-req-btn' onClick={() => setReqPage(true)}>
        {friendRequests.length >= 1 && <FriendsNotification />}
        <div className='all'>
          <AiOutlineUserSwitch size={30} />
        </div>
      </div>
      <FriendsRequestPage reqPage={reqPage} setReqPage={setReqPage} />
    </React.Fragment>
  )
}

export default FriendsReqBtn
