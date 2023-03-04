import React from 'react'
import { motion } from 'framer-motion'
function ChatMsg({ reverse, txt, time }) {
  return (
    <motion.div
      initial={
        reverse === true ? { x: 50, opacity: 0 } : { x: -50, opacity: 0 }
      }
      animate={{ x: 0, opacity: 1 }}
      className={reverse === true ? 'msg-wrapper reverse' : 'msg-wrapper'}
    >
      <div className='msg'>
        <div className='txt' dir='auto'>
          {txt}
        </div>
        <time>{time}</time>
      </div>
    </motion.div>
  )
}

export default ChatMsg
