import React, { useState } from 'react'
import FacebookSignIn from './FacebookSignIn'
import GoogleSignIn from './GoogleSignIn'

function SignInBtns() {
  const [clicked, setClicked] = useState(false)
  return (
    <div className='btn-co'>
      <GoogleSignIn clicked={clicked} setClicked={setClicked} />
      <FacebookSignIn clicked={clicked} setClicked={setClicked} />
    </div>
  )
}

export default SignInBtns
