import React from 'react'
import Ripples from 'react-ripples'
import { BsFlag } from 'react-icons/bs'
import { GiOverkill } from 'react-icons/gi'
function PlayAgain({ anotherFriend, refuseReqAagin, acceptReqAgain }) {
  return (
    <section>
      <h3>{anotherFriend?.displayName} want play another game</h3>
      <div>
        <Ripples className='strict-btn' onClick={refuseReqAagin}>
          Give up <BsFlag />
        </Ripples>
        <Ripples className='accept green-flag' onClick={acceptReqAgain}>
          Get him! <GiOverkill size={18} />
        </Ripples>
      </div>
    </section>
  )
}

export default PlayAgain
