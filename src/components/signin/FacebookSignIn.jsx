import { getAdditionalUserInfo, signInWithPopup } from 'firebase/auth'
import React from 'react'
import { BsFacebook } from 'react-icons/bs'
import Ripples from 'react-ripples'
// import { useUser } from '../../contexts/UserContext'
import { auth, facebookProvider, initNewUser } from '../../firebase.config'

function FacebookSignIn({ clicked, setClicked }) {
  // const { displayError } = useUser()
  const facebookSigninHandler = () => {
    setClicked(true)
    signInWithPopup(auth, facebookProvider)
      .then((user) => {
        if (getAdditionalUserInfo(user).isNewUser) {
          initNewUser(user)
        }
        setClicked(false)
      })
      .catch((er) => {
        console.log(er.message)
        setClicked(false)
        // displayError(er.code)
      })
  }
  return (
    <Ripples
      className={
        clicked === true
          ? 'sign-in-btn disabled-flag avoid-pointer-events'
          : 'sign-in-btn'
      }
      onClick={facebookSigninHandler}
    >
      <BsFacebook fill='#1977F3' size={18} />
      Sign in with Facebook
    </Ripples>
  )
}

export default FacebookSignIn
