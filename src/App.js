import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import './Styles/globalstyles.css'
import './index.css'
import GameSoundContextProvider from './contexts/GameSoundContext'
import AuthRoute from './routes/manager/AuthRoute'
import NoAuthRoute from './routes/manager/NoAuthRoute'
import GameContextProvider from './contexts/GameContext'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTheme } from './contexts/ThemeContext'
import {
  MdSignalWifiStatusbarConnectedNoInternet,
  MdSignalWifi4Bar,
} from 'react-icons/md'
import { off, onValue, ref, set } from 'firebase/database'
import { realtimedb } from './firebase.config'
import { useUser } from './contexts/UserContext'
import Loader from './components/reusable/Loader'

const SignIn = React.lazy(() => import('./routes/SignIn'))
const NotFound = React.lazy(() => import('./routes/Errors/NotFound'))
const OnlineBoard = React.lazy(() => import('./routes/GameOutlet/OnlineBoard'))
const FriendsPage = React.lazy(() => import('./routes/GameOutlet/FriendsPage'))
const HomePage = React.lazy(() => import('./routes/GameOutlet/HomePage'))
const Board = React.lazy(() => import('./routes/GameOutlet/Board'))
const Settings = React.lazy(() => import('./routes/GameOutlet/Settings'))
const Game = React.lazy(() => import('./routes/Game'))
const GameManager = React.lazy(() => import('./routes/manager/GameManager'))
// import click00 from './assets/click00.wav'
// import click from './assets/click.wav'

function App() {
  const { theme } = useTheme()
  const { user } = useUser()
  const [openGamesHistory, setOpenGamesHistory] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (openGamesHistory) {
      window.history.pushState({ openGamesHistory: true }, null, '/')
    }
  }, [openGamesHistory])

  useEffect(() => {
    console.log('Performane apply #1')
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
    const handleBackButton = (event) => {
      if (event.state.openGamesHistory) {
        setOpenGamesHistory(false)
      }
    }
    // If user being offline
    window.addEventListener('offline', offLineHandler)
    // If user back online after offline
    window.addEventListener('online', onlineHandler)
    window.addEventListener('popstate', handleBackButton)
    return () => {
      window.addEventListener('offline', offLineHandler)
      window.addEventListener('online', onlineHandler)
      window.removeEventListener('popstate', handleBackButton)
      off(connectedRef, 'value', userStatusHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <main>
      <GameSoundContextProvider>
        <GameContextProvider>
          <React.Suspense fallback={<Loader />}>
            <Routes>
              <Route element={<AuthRoute />}>
                <Route path='/' element={<Game />}>
                  <Route
                    index
                    element={
                      <HomePage
                        openGamesHistory={openGamesHistory}
                        setOpenGamesHistory={setOpenGamesHistory}
                      />
                    }
                  />
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
          </React.Suspense>
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
