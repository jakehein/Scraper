// make exportable? Module type in background service worker?
// const messageType = {
//   scrapePage: 'scrapePage',
//   downloadContentJSON: 'downloadContentJSON',
//   test: 'test',
// };

chrome.runtime.onInstalled.addListener(() => {
  console.log('installed');
  // var popup = document.getElementById('myPopup');
  // popup.innerHTML = `Nope. Go to ${ygoWiki} to start scraping!`;
});


// chrome.runtime.onMessage.addListener(
//   async (message, sender, sendResponse) => { //doublecheck syntax
//     switch (message.message) {
//       case messageType.scrapePage:
//         //await chrome.storage.local.set(message);
//         console.log(message);
//         sendResponse({
//           status: chrome.runtime.lastError ? 'error': 'page scraped'
//         });
//         break;
//       case messageType.downloadContentJSON:
//         //await chrome.storage.local.set(message);
//         console.log(message);
//         sendResponse({
//           status: chrome.runtime.lastError ? 'error': 'content downloaded'
//         });
//         break;
//       case messageType.test:
//         console.log(sender, " from background")
//         await chrome.tabs.sendMessage(
//           sender.id,
//           { message: messageType.test }
//         );
//       default:
//         sendResponse(null);
//     }
// });

// chrome.runtime.onMessage.addListener((message) => {
//   if (message.message === 'test'){
//     chrome.notifications.create({
//       "type": "basic",
//       "title": "this is a test",
//       "message": message.message
//     });
//   }
// });
