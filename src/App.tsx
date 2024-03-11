import './app.css'
import Timer from './components/Timer'
import { useState } from 'react'
import { times } from 'lodash-es'

export default function App() {
  const timerConfig: any = {
    'session': {
      icon: "laptop_mac",
      duration: 25 * 60,
      text: "Stay Focused",
      color: "#0098F7"
    },
    'short_break': {
      icon: "local_cafe",
      duration: 5 * 60,
      text: "Short Break",
      color: "#07B583"
    },
    'long_break': {
      icon: "hotel",
      duration: 15 * 60,
      text: "Long Break",
      color: "#D48D0A"
    }
  }
    
  const [sessionsCount, setSessionsCount] = useState(0)
  const [currentTimerType, setCurrentTimerType] = useState('session')
  const [isSoundOn, setIsSoundOn] = useState(true)
  
  const alertSound = new Audio('./assets/alert.mp3')

  const onTimerEnd = () => {
    if (isSoundOn) alertSound.play()

    const localSessionsCount = sessionsCount === 8 ? 0 : currentTimerType === 'session' ? sessionsCount + 1 : sessionsCount

    switch(currentTimerType) {
      case 'session':
        setCurrentTimerType(localSessionsCount % 2 === 0 ? 'long_break' : 'short_break')
        break
      case 'short_break':
      case 'long_break':
        setCurrentTimerType('session')
        break
    }

    setSessionsCount(localSessionsCount)
  }
  
  return (<>
    <main>
      <span id="notification-option" className="material-symbols-outlined" onClick={() => setIsSoundOn(!isSoundOn)}>
        {isSoundOn ? 'notifications_active' : 'notifications_off'}
      </span>

      <h2>Pomodoro Clock</h2>
      <Timer timerOpts={timerConfig[currentTimerType]} onTimerEnd={onTimerEnd}/>
      <h3>
        { times( sessionsCount, () => '🍅 ' )}
        { times( 8 - sessionsCount, () => '\u00A0\u00A0•\u00A0\u00A0')}   
      </h3>
      {/* <div id="menu">
        <span className="material-symbols-outlined">bar_chart</span>
        <span className="material-symbols-outlined">home</span>
        <span className="material-symbols-outlined">settings</span>
      </div> */}

    </main>
  </>
  )
}
