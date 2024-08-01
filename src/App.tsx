import { useEffect, useState } from 'react'
import './App.css'


function Main() {

  console.log("Can I see the document?", document)
 
  const elements = document.querySelectorAll(".clock-component");

  //@TODO Use this as an example message
  chrome.runtime.sendMessage({ type: 'TIME_CHANGED', payload: "WE ARE SO BACK IT WORKS" });
  
  let observerList: any = []
  elements.forEach((el) => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          console.log('Time changed:', mutation.target.textContent);
      });
    });

      observer.observe(el, { characterData: true, subtree: true, childList: true });
      observerList.push(observer)
      console.log("Observer hooked up", el)
  });
      
  return observerList
}
function App() {
  const [count, setCount] = useState(0)
  const [_time, setTime] = useState('');


  const loadPage = async() => {
    console.log("Begin async")
    let [tab] = await chrome.tabs.query({active: true});
    chrome.scripting.executeScript({
      target: {tabId: tab.id!},
      func: Main
    
    //   func:  () => {
    //     const chatWindow: any = document.querySelector('.game-start-message-component'); // Updated class name
    //     console.log(chatWindow.childNodes[4].childNodes[0].innerText.trim(), " DID I GET THE USERNAME????")

    //     const usernameElement: any = document.querySelector('.user-tagline-username'); // Updated class name
    //     if(usernameElement != null){
          
    //       const username = usernameElement != null ? usernameElement.textContent.trim() : 'Username not found';
    //       console.log('Username:', username);
    //     }
        

    //     //https://github.com/Hyper-Dragon/DgtAngel/blob/main/sourceExt/DgtAngelCdcPlay/src/js/inject/cdcPlayBoard.js
    //     let whiteClock = document.getElementsByClassName("clock-white")[0];

    //     whiteClock
    //     console.log("White clock:")
    //     console.log(whiteClock)
    //     // blackClock = document.getElementsByClassName("clock-black")[0];
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
        Chess Stoppa
      </p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>     
    </>
  )
}

export default App
