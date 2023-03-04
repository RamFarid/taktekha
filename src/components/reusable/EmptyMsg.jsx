import React from 'react'

function EmptyMsg({ txt, subtxt }) {
  return (
    <div className='msg-empty'>
      <div className='txt-msg'>{txt}</div>
      <div className='subtxt-msg sub-txt'>{subtxt}</div>
    </div>
  )
}

export default EmptyMsg
