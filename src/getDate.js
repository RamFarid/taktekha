const getDate = (timeInSeconds) => {
  const timeInMiliSeconds = timeInSeconds * 1000
  const newDate = new Date(timeInMiliSeconds)
  const date = newDate.toLocaleDateString('de-DE')
  const time = newDate.toLocaleTimeString('en-US')
  return `${date} at ${time}`
}

export const getDateDiff = (time) => {
  let countDownDate = time
  let dateNow = new Date().getTime()

  // Find The Date Difference Between Now And Countdown Date
  let dateDiff = dateNow - countDownDate

  // Get Time Units
  // let days = Math.floor(dateDiff / 1000 / 60 / 60 / 24);
  let days = Math.floor(dateDiff / (1000 * 60 * 60 * 24))
  let hours = Math.floor((dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60))
  let seconds = Math.floor((dateDiff % (1000 * 60)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

export default getDate
