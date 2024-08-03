import { useEffect } from 'react'
import './App.css'

// Why did I start to use react and then didnt? Well because react SUCKS :)


function main() {
  const alreadyActive = document.getElementById('CHESS-STOPPA-ONLINE')
  if(alreadyActive){
    return console.log('Already online')
  }
  const DEFAULT_COLOR = document.body.style.backgroundColor

  const dialogBox = document.createElement('div')
  dialogBox.id = 'CHESS-STOPPA-ONLINE'
  dialogBox.style.backgroundColor = 'white'
  dialogBox.style.padding = '5px'
  dialogBox.style.borderRadius = '8px'
  dialogBox.style.textAlign = 'center'
  dialogBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
  dialogBox.style.height = '150px'

  const timeBetweenTurns = document.createElement('input')
  timeBetweenTurns.id = 'tbt'
  timeBetweenTurns.textContent = '5'
  timeBetweenTurns.type = 'range'
  timeBetweenTurns.min =  "3" 
  timeBetweenTurns.value =  "5" 
  timeBetweenTurns.max =  "30"
  dialogBox.appendChild(timeBetweenTurns)
  

  const rangeValueDisplay = document.createElement('p')
  rangeValueDisplay.id = 'countdownText'
  rangeValueDisplay.style.fontSize = '24px'
  rangeValueDisplay.style.color = '#a78989'
  rangeValueDisplay.style.paddingBottom = '10px'
  rangeValueDisplay.textContent = 'Chess Stopa Active'
  dialogBox.appendChild(rangeValueDisplay)


  const countdownText = document.createElement('p')
  countdownText.id = 'countdownText'
  countdownText.style.fontSize = '24px'
  countdownText.style.color = '#333'
  countdownText.textContent = 'Chess Stopa Active'
  dialogBox.appendChild(countdownText)

  const updateRangeValue = () => {
    rangeValueDisplay.textContent = `Freeze time: ${timeBetweenTurns.value}`
  }

  const isVisible = (element: any) => {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  }

  timeBetweenTurns.addEventListener('input', updateRangeValue)

  updateRangeValue()
  
  document.body.insertBefore(dialogBox, document.body.firstChild)

  const checkIfGameIsOver = () => {
    const gameIsOver = document.querySelector('.board-modal-container-container')
    
    if(gameIsOver && isVisible(gameIsOver)){
      location.reload() 

    }
  }
  const getPlayerName = (): string => {
    const bottomBar = document.querySelector('.board-layout-bottom')
    if(bottomBar){
      const userTagline: any = bottomBar.querySelector('.user-tagline-username')
      return userTagline.innerText.trim()
    }
    return "[player name not found]"
  }
  
  const getMyClock = () => {
    const myPlayerName = getPlayerName()
    const whiteClock = document.getElementsByClassName("clock-white")[0]
    const blackClock = document.getElementsByClassName("clock-black")[0]
    
    //@ts-ignore
    if(whiteClock.parentNode.parentNode.querySelector('.user-username-component').innerText.trim() == myPlayerName){
      return [whiteClock, blackClock]
    }else{
      return [blackClock, whiteClock]
    }   
  }

  const getTimeFromClock = (clock: any): number => {
    
    const time = clock.querySelector('.clock-time-monospace').innerText
    const [minutes, seconds] = time.split(':')
    const totalMinutes = parseInt(minutes, 10)
    const totalSeconds = parseInt(seconds, 10)
    const result = totalMinutes * 60 + totalSeconds

    return result
  }
  
  let myMinTime = Infinity
  const freezePlayerBoard = () => {
    const remainingTime = getTimeFromClock(myClock)
    
    if(remainingTime >= myMinTime){
      //console.log("ITS NOT MY MOSt RECENT TURN")
      return
    } 

    myMinTime = Math.min(myMinTime, remainingTime)

    if(remainingTime < 120){
      console.log("Less than 1 min remaining, skipping timeout")    
    }else{
      let countdown = parseInt(timeBetweenTurns.value) -1

      document.body.style.backgroundColor = 'grey'
      countdownText.innerText = `${countdown + 1}`
      document.documentElement.style.setProperty('pointer-events', 'none')


  
      const timer = setInterval(() => {
        if (countdown > 0) {
          countdownText.innerText = `${countdown}` 
          countdown--
        } else {
          countdownText.innerText = "u can play :) uwu"
          document.documentElement.style.setProperty('pointer-events', 'auto')
          document.body.style.backgroundColor = DEFAULT_COLOR
          clearInterval(timer) // Stop the interval
          checkIfGameIsOver()

        }
      }, 1000)     
    }
  }

  //@ts-ignore
  const [myClock, opponentClock] = getMyClock()
  
  const turnChangeChecker = document.querySelector('.clock-top')
  const turnObserver = new MutationObserver((mutations) => {
    mutations.forEach((_) => {
      checkIfGameIsOver()
      if (myClock.classList.contains("clock-player-turn")) {
        freezePlayerBoard()
      }
    })
  })
  //@ts-ignore
  turnObserver.observe(turnChangeChecker, {
    attributes: true,
    characterData: true,
    subtree: false,
    childList: false
  })
  checkIfGameIsOver()
  return 
}
function App() {
  const loadPage = async() => {
    let [tab] = await chrome.tabs.query({active: true})
    chrome.scripting.executeScript({
      target: {tabId: tab.id!},
      func: main
     })
  }

  useEffect(()=>{ 
      loadPage()
    }, [])

  return (
    <>
      <p>
        Chess Stoppa :D
      </p>
    </>
  )
}

export default App
