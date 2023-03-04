import React, { useState } from 'react'
import LoaderAccount from '../components/signin/LoaderAccount'
import Overview from '../components/signin/Overview'
import SignInBtns from '../components/signin/SignInBtns'

import '../Styles/sign-in.css'
function SignIn() {
  const [accountLoader] = useState(false)
  return (
    <section className='SIGN_IN START__UP'>
      <Overview />
      <SignInBtns />
      {accountLoader && <LoaderAccount />}
    </section>
  )
}

export default SignIn
