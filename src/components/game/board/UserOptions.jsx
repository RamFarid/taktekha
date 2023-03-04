import React from 'react'
import { BsFillChatDotsFill } from 'react-icons/bs'
import { GrEmoji } from 'react-icons/gr'
import FriendsNotification from '../../reusable/FriendsNotification'

function UserOptions({ chatHandler, qChatHandler, seen }) {
  return (
    <div className='user-options'>
      <figure className='chat-ico' onClick={chatHandler}>
        {seen === false ? <FriendsNotification /> : null}
        <BsFillChatDotsFill size={16.5} />
      </figure>
      <figure className='q-chat-ico' onClick={qChatHandler}>
        <GrEmoji size={20} />
      </figure>
    </div>
  )
}

export default UserOptions
