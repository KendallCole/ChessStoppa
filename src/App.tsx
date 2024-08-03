import { useEffect, useState } from 'react'
import './App.css'
//https://github.com/Hyper-Dragon/DgtAngel/blob/main/sourceExt/DgtAngelCdcPlay/src/js/inject/cdcPlayBoard.js


function main() {
  const DEFAULT_COLOR = document.body.style.backgroundColor


  // Create the dialog box
  const dialogBox = document.createElement('div');
  dialogBox.style.backgroundColor = 'white';
  dialogBox.style.padding = '5px';
  dialogBox.style.borderRadius = '8px';
  dialogBox.style.textAlign = 'center';
  dialogBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  dialogBox.style.height = '150px'


  const timeBetweenTurns = document.createElement('input')
  timeBetweenTurns.id = 'tbt'
  timeBetweenTurns.textContent = '5'
  timeBetweenTurns.type = 'range'
  timeBetweenTurns.min =  "1" 
  timeBetweenTurns.value =  "5" 
  timeBetweenTurns.max =  "30"
  dialogBox.appendChild(timeBetweenTurns)
  

  const rangeValueDisplay = document.createElement('p')
  rangeValueDisplay.id = 'countdownText'
  rangeValueDisplay.style.fontSize = '24px'
  rangeValueDisplay.style.color = '#a78989'
  rangeValueDisplay.style.paddingBottom = '10px'
  rangeValueDisplay.textContent = 'Chess Stopa Active'
  dialogBox.appendChild(rangeValueDisplay);


  const countdownText = document.createElement('p');
  countdownText.id = 'countdownText';
  countdownText.style.fontSize = '24px';
  countdownText.style.color = '#333';
  countdownText.textContent = 'Chess Stopa Active';
  dialogBox.appendChild(countdownText);

  function updateRangeValue() {
    rangeValueDisplay.textContent = `Freeze time: ${timeBetweenTurns.value}`;
  }

  // Listen for the input event on the range input
  timeBetweenTurns.addEventListener('input', updateRangeValue);

  // Initialize the display with the default range value
  updateRangeValue();



  // Append dialogBox to overlay

  // Append overlay to the body
  document.body.insertBefore(dialogBox, document.body.firstChild);


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

    // Convert both parts to numbers
    const totalMinutes = parseInt(minutes, 10)
    const totalSeconds = parseInt(seconds, 10)

    // Calculate total seconds
    const result = totalMinutes * 60 + totalSeconds

    return result
    

  }
  
  let myMinTime = Infinity
  const freezePlayerBoard = () => {
    
    console.log("My turn: FORCING PLAYER TO WAIT TO MOVE", console.log((myClock)))
    const remainingTime = getTimeFromClock(myClock)
    
    if(remainingTime >= myMinTime){
      console.log("ITS NOT MY MOSt RECENT TURN")
      return
    } 
    console.log("It is my most recent turn!")
    myMinTime = Math.min(myMinTime, remainingTime)

    console.log("Time remaining: ", remainingTime)
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
          clearInterval(timer); // Stop the interval
        }
      }, 1000); // 1000 ms = 1 second



    
    }
  }

 
  const [myClock, opponentClock] = getMyClock();
  console.log("My clock?", myClock)
  console.log("Opponent clock?", opponentClock)


  const turnChangeChecker = document.querySelector('.clock-top')
  const turnObserver = new MutationObserver((mutations) => {
    mutations.forEach((_) => {
      console.log("TURNS CHANGED")
      if (myClock.classList.contains("clock-player-turn")) {
        freezePlayerBoard()
      }
    });
  })
  //@ts-ignore
  turnObserver.observe(turnChangeChecker, {
    attributes: true,
    characterData: true,
    subtree: false,
    childList: false
  })
  
  // const opponentTimeObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     console.log('His Time changed:', mutation.target.textContent);
  //     //@TODO Freeze board for X amount of time.
      
      
  //    
    
  //   });
  // });

  // const myTimeObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     console.log('My Time changed:', mutation.target.textContent);
  //   });
  // });

  // // Make sure the observer is observing outside the loop
  
  // //@ts-ignore
  // opponentTimeObserver.observe(opponentClock.querySelector('.clock-time-monospace'), {
  //   attributes: true,
  //   characterData: true,
  //   subtree: true,
  //   childList: true
  // })

  // //@ts-ignore
  // myTimeObserver.observe(myClock.querySelector('.clock-time-monospace') , {
  //   attributes: true,
  //   characterData: true,
  //   subtree: true,
  //   childList: true
  // })
      
  chrome.runtime.sendMessage({ type: 'TIME_CHANGED', payload: "WE ARE SO BACK IT WORKS" });

  return 
}
function App() {
  const [_time, setTime] = useState('');


  const loadPage = async() => {
    let [tab] = await chrome.tabs.query({active: true});
    chrome.scripting.executeScript({
      target: {tabId: tab.id!},
      func: main
    
    //   func:  () => {
        

    //     // turn = turnCodes.NONE;

    //     // // Use the clocks to detect the turn
    //     // if (whiteClock.classList.contains("clock-player-turn")) {
    //     //     turn = turnCodes.WHITE;
    //     // } else if (blackClock.classList.contains("clock-player-turn")) {
    //     //     turn = turnCodes.BLACK;
    //     // }
      
    //     // document.documentElement.style.setProperty('pointer-events', 'none')
    //     console.log("NO POINTER EVENTS")
          
    //     const elements = document.querySelectorAll(".clock-component");

    //     elements.forEach((el) => {
    //       console.log("FOunc clock, observing")
    //       const observer = new MutationObserver((mutations) => {
    //         mutations.forEach((mutation) => {
    //             console.log('Time changed:', mutation.target.textContent);
    //         });
    //       });
      
    //         observer.observe(el, { characterData: true, subtree: true, childList: true });
          
    //     });

    //     document.body.style.backgroundColor = 'black';
    //     console.log("Removing shiz")
    //     const moveList = document.querySelector('.vertical-move-list-component');
    //     if (!moveList) {
    //       console.error('Move list not found! XD');
    //       return;
    //     }
    //     console.log("Move list found :)")

    //     // Create an observer to track changes to the move list
    //     // const observer = new MutationObserver((mutationsList) => {
    //     //   for (const mutation of mutationsList) {
    //     //     if (mutation.type === 'childList') {
    //     //       const moves = moveList.querySelectorAll('.move');
    //     //       const lastMove = moves[moves.length - 1];
  
    //     //       if (lastMove) {
    //     //         //@ts-ignore
    //     //         console.log(`New Move: ${lastMove.innerText}`);
    //     //       }
    //     //     }
    //     //   }
    //     // });
  
    //   // Configure the observer to watch for added nodes
    //   // observer.observe(moveList, { childList: true, subtree: true });
    //   }
     }).then( _ => {
        console.log("Done running?")
     })
  }
  useEffect(()=>{
   
      loadPage()
      const handleMessage = (request: any) => {
        if (request.type === 'UPDATE_TIME') {
          console.log('Received time update:', request.payload);
          setTime(request.payload);
        }
      };
  
      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener(handleMessage);
  
      // Cleanup listener on component unmount
      return () => {
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }, []);

  return (
    <>
      <p>
        Chess Stoppa :D
      </p>
    </>
  )
}

export default App
