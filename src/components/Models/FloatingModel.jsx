import React from 'react'
import ReactDOM from 'react-dom'
import { motion } from 'framer-motion'
function FloatingModel({ children, closePortal, className }) {
  return ReactDOM.createPortal(
    <motion.section
      onClick={closePortal ? closePortal : () => {}}
      className='PORTALS'
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`data-wrapper ${className}`}
      >
        {children}
      </motion.div>
    </motion.section>,
    document.getElementById('portals')
  )
}

export default FloatingModel
