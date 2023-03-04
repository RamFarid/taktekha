import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Game from './routes/Game'
import SignIn from './routes/SignIn'
import './Styles/globalstyles.css'
import './index.css'
import FriendsPage from './routes/GameOutlet/FriendsPage'
import HomePage from './routes/GameOutlet/HomePage'
import Board from './routes/GameOutlet/Board'
import Settings from './routes/GameOutlet/Settings'
import GameSoundContextProvider from './contexts/GameSoundContext'
import AuthRoute from './routes/manager/AuthRoute'
import NoAuthRoute from './routes/manager/NoAuthRoute'
import GameContextProvider from './contexts/GameContext'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import OnlineBoard from './routes/GameOutlet/OnlineBoard'
import { useTheme } from './contexts/ThemeContext'
import GameManager from './routes/manager/GameManager'
import {
  MdSignalWifiStatusbarConnectedNoInternet,
  MdSignalWifi4Bar,
} from 'react-icons/md'
import NotFound from './routes/Errors/NotFound'
import { off, onValue, ref, set } from 'firebase/database'
import { realtimedb } from './firebase.config'
import { useUser } from './contexts/UserContext'
// import click00 from './assets/click00.wav'
// import click from './assets/click.wav'

function App() {
  const { theme } = useTheme()
  const { user } = useUser()
  const location = useLocation()
  useEffect(() => {
    // On online
    const connectedRef = ref(realtimedb, '.info/connected')
    const userStatusHandler = (snap) => {
      if (snap.val() && location.pathname.includes('/board/') !== true) {
        if (user?.uid)
          set(ref(realtimedb, `users/${user?.uid}/status`), 'online')
      }
    }
    onValue(connectedRef, userStatusHandler)

    // If user open website with offline state
    if (!navigator.onLine) {
      toast.error("You're offline", {
        autoClose: false,
        closeOnClick: false,
        className: 'offline-toast',
        draggable: false,
        toastId: 'offline-state',
        icon: <MdSignalWifiStatusbarConnectedNoInternet fill='#ff3333' />,
      })
    }
    const onlineHandler = () => {
      toast.dismiss('offline-state')
      toast.success('Back online', {
        icon: <MdSignalWifi4Bar fill='#4BB543' />,
        toastId: 'online-state',
      })
    }
    const offLineHandler = () => {
      toast.dismiss('online-state')
      toast.error("You're offline", {
        autoClose: false,
        closeOnClick: false,
        className: 'offline-toast',
        draggable: false,
        toastId: 'offline-state',
        icon: <MdSignalWifiStatusbarConnectedNoInternet fill='#ff3333' />,
      })
    }
    // If user being offline
    window.addEventListener('offline', offLineHandler)
    // If user back online after offline
    window.addEventListener('online', onlineHandler)
    return () => {
      window.addEventListener('offline', offLineHandler)
      window.addEventListener('online', onlineHandler)
      off(connectedRef, 'value', userStatusHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <main>
      <GameSoundContextProvider>
        <GameContextProvider>
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path='/' element={<Game />}>
                <Route index element={<HomePage />} />
                <Route path='friends' element={<FriendsPage />} />
                <Route path='settings' element={<Settings />} />
              </Route>
              <Route element={<GameManager />}>
                <Route path='/board/:id' element={<OnlineBoard />} />
              </Route>
              <Route path='/board' element={<Board />} />
            </Route>
            <Route element={<NoAuthRoute />}>
              <Route path='/login' element={<SignIn />} />
            </Route>
            <Route path='/*' element={<NotFound />} />
          </Routes>
        </GameContextProvider>
      </GameSoundContextProvider>
      <ToastContainer
        position='top-center'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme={theme}
        draggablePercent={58}
        limit={4}
        transition={Zoom}
        progressStyle={{
          color: 'var(--primary-color)',
        }}
      />
    </main>
  )
}

export default App
