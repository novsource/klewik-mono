import confetti from 'canvas-confetti'
import { transform } from 'motion'

export const startWinnerConfetti = () => {
  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 102 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
  }, 250)

  return interval
}

type DropoutConfettiOptions = {
  duration?: number
}

export const startDropoutConfetti = (options?: DropoutConfettiOptions) => {
  const duration = options?.duration ?? (15 * 1000)
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 102 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
  }, 250)

  return interval
}

type FireCardConfettiOptions = {
  duration?: number
  startY: number
  endY: number
}

// const cloverConfetti = confetti.shapeFromPath({
//   path: 'M17.4212 28.854L19.8394 28.854C23.6935 28.854 26.9105 31.5815 27.6655 35.2115L27.6655 29.9764C27.6655 27.1138 25.345 24.7933 22.4824 24.7933C20.0053 24.7933 17.9341 26.531 17.4212 28.854ZM27.5505 36.8476C27.0495 39.1863 24.9707 40.9397 22.4824 40.9397C19.9941 40.9397 17.9154 39.1863 17.4143 36.8476L27.5505 36.8476ZM14.6791 29.9764C14.6791 25.6668 18.1728 22.1731 22.4824 22.1731C26.792 22.1731 30.2857 25.6668 30.2857 29.9764L30.2857 35.7566C30.2857 40.0663 26.792 43.5599 22.4824 43.5599C18.1728 43.5599 14.6791 40.0663 14.6791 35.7566L14.6791 29.9764ZM48.6123 36.8474C48.1113 39.1862 46.0325 40.9397 43.5442 40.9397C41.0558 40.9397 38.977 39.1862 38.476 36.8474L48.6123 36.8474ZM48.7273 35.5452L48.7273 29.9764C48.7273 27.1139 46.4067 24.7933 43.5442 24.7933C41.0671 24.7933 38.9959 26.531 38.483 28.8538L40.8391 28.8538C44.8104 28.8538 48.1054 31.7498 48.7273 35.5452ZM35.7409 29.9764C35.7409 25.6668 39.2345 22.1731 43.5442 22.1731C47.8538 22.1731 51.3475 25.6668 51.3475 29.9764L51.3475 35.7566C51.3475 40.0662 47.8538 43.5599 43.5442 43.5599C39.2345 43.5599 35.7409 40.0663 35.7409 35.7566L35.7409 29.9764ZM5.74732 33.8906C-1.33527 40.9732 -1.33531 52.4561 5.74732 59.5387C12.83 66.6213 24.3131 66.6214 31.3957 59.5388C31.97 58.9646 32.901 58.9645 33.4751 59.5386C40.5578 66.6212 52.0409 66.6213 59.1236 59.5387C66.206 52.4561 66.206 40.973 59.1236 33.8904C58.5493 33.3163 58.5493 32.3854 59.1236 31.8112C66.206 24.7286 66.206 13.2454 59.1236 6.16282C52.0409 -0.919994 40.5578 -0.91934 33.4751 6.16295C32.901 6.7371 31.9699 6.73704 31.3957 6.16276C24.3131 -0.91999 12.83 -0.919991 5.74732 6.16283C-1.33532 13.2455 -1.33527 24.7285 5.74732 31.811C6.32158 32.3852 6.32158 33.3163 5.74732 33.8906Z',
// })

export const startFireCardConfetti = (options: FireCardConfettiOptions) => {
  const duration = options.duration ? options.duration * 1000 : (7.5 * 1000)
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 80, spread: 120, ticks: 120, zIndex: 102 }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)
    const y = transform(timeLeft, [duration, 0], [options.startY, options.endY])

    // confetti({ ...defaults, shapes: ['circle'], colors: ['#74dfa2', '#519c71'], particleCount, origin: { x: randomInRange(0.47, 0.515), y }, angle: 90, scalar: 0.75, flat: true, gravity: 3.25 })
    // confetti({ ...defaults, shapes: ['circle'], colors: ['#74dfa2', '#519c71'], particleCount, origin: { x: randomInRange(0.45, 0.545), y }, angle: 90, scalar: 0.75, flat: true, gravity: 3.25 })
    // confetti({ ...defaults, shapes: [cloverConfetti], colors: ['#519c71', '#74dfa2'], particleCount, origin: { x: randomInRange(0.46, 0.535), y }, angle: 90, scalar: 1.25, flat: true, gravity: 3.25 })
    confetti({ ...defaults, shapes: ['circle'], colors: ['#f76b63', '#cfc56f'], particleCount, origin: { x: randomInRange(0.46, 0.535), y }, angle: 90, scalar: 0.3, flat: true, gravity: 3.25 })
    confetti({ ...defaults, shapes: ['circle'], colors: ['#f76b63', '#cfc56f'], particleCount, origin: { x: randomInRange(0.46, 0.535), y }, angle: 90, scalar: 0.35, flat: true, gravity: 3.25 })
    confetti({ ...defaults, shapes: ['circle'], colors: ['#f76b63', '#cfc56f'], particleCount, origin: { x: randomInRange(0.46, 0.535), y }, angle: 90, scalar: 0.35, flat: true, gravity: 3.25 })
    confetti({ ...defaults, shapes: ['circle'], colors: ['#f76b63', '#cfc56f'], particleCount, origin: { x: randomInRange(0.46, 0.535), y }, angle: 90, scalar: 0.35, flat: true, gravity: 3.25 })
  }, 250)

  return interval
}
