import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

interface TimerProps {
  timerOpts: any
  onTimerEnd: Function
}

const Timer: React.FC<TimerProps> = ({ timerOpts, onTimerEnd, ...rest }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerId = useRef<number | undefined>()

  const [durationInSecs, setDuration] = useState(timerOpts.duration)
  const [isHovered, setIsHovered] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const timerRingStyle: any = {
    diameter: 200,
    strokeWidth: 5,
    colouredStroke: '#07B080',
    transparentStroke: '#414345'
  }
  timerRingStyle.center = timerRingStyle.diameter / 2

  const drawProgressArc = (percentage: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = canvas.height = timerRingStyle.diameter

    const startAngle = 1.5 * Math.PI
    const endAngle = -0.5 * Math.PI + (percentage * Math.PI * 2)

    context.lineWidth = timerRingStyle.strokeWidth
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.beginPath()
    context.arc(timerRingStyle.center, timerRingStyle.center, timerRingStyle.center - context.lineWidth / 2, startAngle, endAngle)
    context.strokeStyle = timerOpts.color//timerRingStyle.colouredStroke
    context.stroke()

    context.beginPath()
    context.arc(timerRingStyle.center, timerRingStyle.center, timerRingStyle.center - context.lineWidth / 2, endAngle, startAngle)
    context.strokeStyle = timerRingStyle.transparentStroke
    context.stroke()
  }

  const runTimer = (duration: number) => {
    timerId.current = window.setInterval(() => {
      if (duration === 0) {
        clearInterval(timerId.current)
        onTimerEnd()
        return
      } else {
        duration -= 1
      }
      const nextPercentage = (duration / (timerOpts.duration))
      if (nextPercentage >= 1) {
        clearInterval(timerId.current)
        return
      }
      drawProgressArc(nextPercentage)
      setDuration(duration)
    }, 1000)
  }


  useEffect(() => {
    if (isRunning) {
      runTimer(durationInSecs)
    } else {
      clearInterval(timerId.current)
    }
    return () => clearInterval(timerId.current)
  }, [isRunning])

  useEffect(() => {
    setIsRunning(false)
    setDuration(timerOpts.duration)
    drawProgressArc(100)
  }, [timerOpts])

  useEffect(() => {
    setIsRunning(false)
    setDuration(timerOpts.duration)
    drawProgressArc(100)
  }, [])

  const toggleTimer = () => {
    setIsRunning(prevState => !prevState)
  }

  return (
    <div id="container" {...rest} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>

      <canvas ref={canvasRef} id="progress-bar"></canvas>
      {isHovered && (
        <span id="play-pause-button" className="material-symbols-outlined" onClick={toggleTimer}>
          {isRunning ? 'pause' : 'play_arrow'}
        </span>
      )}

      <span id="timer-icon" className="material-symbols-outlined" style={{ opacity: isHovered ? 0.2 : 1 }}>{timerOpts.icon}</span>
      <span id="timer-text" style={{ opacity: isHovered ? 0.2 : 1 }}>
        {(Math.floor(durationInSecs / 60)) < 10 ? '0' : ''}{Math.floor(durationInSecs / 60)}:
        {(durationInSecs % 60) < 10 ? '0' : ''}{durationInSecs % 60}
      </span>
      <span id="timer-message" style={{ opacity: isHovered ? 0.1 : 1 }}>
        {isRunning ? timerOpts.text : durationInSecs === timerOpts.duration ? 'Start' : 'Paused'}
      </span>

    </div>
  )
}

export default styled(Timer)`
  height: 200px;
  width: 200px;
  margin: 1em;
  border-radius: 50%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;

  #progress-bar {
    position: absolute;
  }

  #play-pause-button {
    position: absolute;
    font-size: 4em;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  #timer-icon {
    padding: .25em;
  }

  #timer-text {
    padding: .1em;
    font-weight: bold;
    font-size: 2.5em;
  }

  #timer-message {
    padding: .1em;
  }
`;
