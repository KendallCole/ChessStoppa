chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'TIME_CHANGED') {
      console.log('Received message from content script:', request.payload);
  
      // Relay the message to the React app
      chrome.runtime.sendMessage({ type: 'UPDATE_TIME', payload: request.payload });
    }
  });
console.log("Service work is on line baby gurl :) ")
// // content.js

// function logWebpageElements() {
//     console.log("ELEMENT SCRAPER")
//     // Example: Log all the <p> elements on the page
//     const paragraphs = document.querySelectorAll('p');
//     paragraphs.forEach((p) => {
//       console.log('Paragraph:', p.innerText);
//     });
  
//     // Example: Log all elements with a specific class
//     const elements = document.querySelectorAll('.your-class-name');
//     elements.forEach((el) => {
//       console.log('Element with your-class-name:', el);
//     });
//   }
  
//   // Wait for the document to be fully loaded before executing
//   // window.addEventListener('load', logWebpageElements);

//   chrome.scripting.executeScript({
//     target: { tabId: currentTab.id },
//     func: () => window.history.back()
//   }); 