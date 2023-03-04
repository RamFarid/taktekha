import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PortalsTopBar from '../../reusable/PortalsTopBar'
import { useNavigate } from 'react-router-dom'

function JoinMaster({ changePageI }) {
  const navigate = useNavigate()
  const [room, setRoom] = useState('')
  const handleCloseJoinPage = () => {
    changePageI(0)
  }
  const joinRoom = () => {
    if (room.trim().length === 0) return
    navigate(`/board/${room.trim()}`)
  }
  return (
    <motion.div
      className='join-master-wrapper'
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <PortalsTopBar title={'Join room'} closePortal={handleCloseJoinPage} />
      <div className='body'>
        <input
          type='text'
          placeholder='Room ID'
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button
          className={
            room.trim().length === 0
              ? 'master-btn disabled-flag avoid-pointer-events'
              : 'master-btn'
          }
          onClick={joinRoom}
        >
          Join room
        </button>
      </div>
    </motion.div>
  )
}

export default JoinMaster
