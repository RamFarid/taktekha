import React, { useEffect, useState } from 'react'
import SubTitle from '../../components/game/settings/SubTitle'
import TitlePage from '../../components/reusable/TitlePage'
import { useTheme } from '../../contexts/ThemeContext'
import '../../Styles/settings.css'
import { useGameSound } from '../../contexts/GameSoundContext'
import LogOut from '../../components/game/settings/LogOut'
import PersonalData from '../../components/game/settings/PersonalData'
import usePageTitle from '../../hooks/usePageTitle'
import { SocialIcon } from 'react-social-icons'

const ICON_STYLE = { width: '25px', height: '25px', margin: '5px' }

function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { sound, setSound } = useGameSound()
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreen)

  usePageTitle('Taktekha | Settings')

  useEffect(() => {
    function handleFullScreenChange(e) {
      if (document.fullscreenElement) {
        setIsFullScreen(true)
        return
      }
      setIsFullScreen(false)
    }
    document.documentElement.addEventListener(
      'fullscreenchange',
      handleFullScreenChange
    )
    return () => {
      document.documentElement.removeEventListener(
        'fullscreenchange',
        handleFullScreenChange
      )
    }
  }, [])

  const handleScreenView = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      return
    }
    document.exitFullscreen()
  }

  return (
    <section className='SETTING__PAGE'>
      <div className='overlay-design' />
      <TitlePage title={'Settings'} />
      <div className='settings-wrapper'>
        <PersonalData />
        <div className='general-settings'>
          <SubTitle txt={'General settings'} />
          <div className={'triggers-btn-wrapper'}>
            <span>Full screen</span>
            <div
              className={isFullScreen ? 'trigger-btn active' : 'trigger-btn'}
              onClick={handleScreenView}
            >
              <div className='pendulum' />
            </div>
          </div>
          <div className={'triggers-btn-wrapper'}>
            <span>Game sound</span>
            <div
              className={sound ? 'trigger-btn active' : 'trigger-btn'}
              onClick={() => setSound((sound) => !sound)}
            >
              <div className='pendulum' />
            </div>
          </div>
          <div className='triggers-btn-wrapper'>
            <span>Dark Theme</span>
            <div
              className={
                theme === 'dark' ? 'trigger-btn active' : 'trigger-btn'
              }
              onClick={toggleTheme}
            >
              <div className='pendulum' />
            </div>
          </div>
          <LogOut />
        </div>
        <div className='more-settings'>
          <SubTitle txt={'More'} />
          <div className='help'>
            <a
              href='https://ramfarid.netlify.app/contact'
              target={'_blank'}
              rel='noopener noreferrer'
            >
              Need help? Contact me
            </a>
          </div>
          <SocialIcon
            url='https://m.me/rraaamm_s'
            style={ICON_STYLE}
            network='facebook'
          />
          <SocialIcon
            url='https://api.whatsapp.com/send?phone=201553706448&text=Welcome%20Ram,%20I%27m%20from%20Taktekha%20game...%20\n%20type%20your%20mwssage%20here'
            style={ICON_STYLE}
          />
          <SocialIcon
            url='mailto:workprojects22@gmail.com'
            style={ICON_STYLE}
          />
        </div>
      </div>
    </section>
  )
}

export default Settings
