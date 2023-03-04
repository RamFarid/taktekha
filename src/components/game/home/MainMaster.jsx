import React from 'react'
import { motion } from 'framer-motion'
import TitlePage from '../../reusable/TitlePage'
import { useNavigate } from 'react-router-dom'
function MainMaster({ changePageI }) {
  const navigateTo = useNavigate()
  return (
    <motion.section
      className='main-master-wrapper'
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
    >
      <TitlePage title={'Game Master'} />
      <button className='master-btn create' onClick={() => changePageI(2)}>
        Create room
      </button>
      <button className='master-btn join' onClick={() => changePageI(1)}>
        Join room
      </button>
      <div className='or'>
        <hr />
        <span className='txt'>OR</span>
      </div>
      <button
        className='master-btn strict-flag'
        onClick={() => navigateTo('/board')}
      >
        play locally
      </button>
      {/* <button className='master-btn ai'>play with AI</button> */}
    </motion.section>
  )
}

export default MainMaster
