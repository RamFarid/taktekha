import React from 'react'
import { motion } from 'framer-motion'
import { FiRotateCw } from 'react-icons/fi'

function EndBtn({ onClick }) {
  return (
    <motion.button
      aria-label='Play another game'
      initial={{ scale: 0.6, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0.5 }}
      className='end-btn'
      onClick={onClick}
    >
      <FiRotateCw size={20} /> One more
    </motion.button>
  )
}

export default EndBtn
