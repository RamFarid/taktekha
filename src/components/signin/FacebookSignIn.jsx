import React from 'react'
import { BsFacebook } from 'react-icons/bs'
import Ripples from 'react-ripples'
import { getAdditionalUserInfo, signInWithPopup } from 'firebase/auth'
import { auth, facebookProvider } from '../../firebase.config'
// import { useUser } from '../../contexts/UserContext'

function FacebookSignIn({ clicked, setClicked }) {
  // const { displayError } = useUser()
  const facebookSigninHandler = () => {
    // toast('The game is undergoing updates now, contact us for more details', {
    //   autoClose: 20000,
    //   hideProgressBar: true,
    //   transition: Slide,
    //   toastId: 'improve',
    // })
    setClicked(true)
    signInWithPopup(auth, facebookProvider)
      .then((user) => {
        if (getAdditionalUserInfo(user).isNewUser) {
          // initNewUser(user)
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
