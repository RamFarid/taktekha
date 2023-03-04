import React from 'react'
// import Ripples from 'react-ripples'
import AccountDataTitle from '../../reusable/AccountDataTitle'

function HomeDataContainer({ onClickContainer, title, children, length }) {
  return (
    <React.Fragment>
      <AccountDataTitle title={title} length={length} />
      <div className='data-co' onClick={onClickContainer}>
        {children}
      </div>
    </React.Fragment>
  )
}

export default HomeDataContainer
