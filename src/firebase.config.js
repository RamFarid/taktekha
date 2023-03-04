import { initializeApp } from 'firebase/app'
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth'
import { toast } from 'react-toastify'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const realtimedb = getDatabase(app)
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()

export const initNewUser = async (credintioals) => {
  await setDoc(doc(db, 'users', credintioals.user.uid), {
    uid: credintioals.user.uid,
    displayName: credintioals.user.displayName,
    friendsList: [],
    games: [0, 0, 0],
    photo: credintioals.user.photoURL,
    time: serverTimestamp(),
  }).catch((error) => {
    toast.error(
      'Error occured while init your account, CONTACT US so I can help you'
    )
    toast.error(error)
  })
}
