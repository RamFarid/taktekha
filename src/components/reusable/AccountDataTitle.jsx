import React from 'react'

function AccountDataTitle({ title, length }) {
  return (
    <h3 className='data-title'>
      {title} {length}
    </h3>
  )
}

export default AccountDataTitle
