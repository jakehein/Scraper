const messageType = {
  scrapePage: 'scrapePage',
  downloadContentJSON: 'downloadContentJSON',
};

chrome.runtime.onInstalled.addListener(() => {
  console.log('this is a test')
  // var popup = document.getElementById('myPopup');
  // popup.innerHTML = `Nope. Go to ${ygoWiki} to start scraping!`;
});

// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(request.content);
//   }
// )

chrome.runtime.onMessage.addListener(
  async (message, sender, sendResponse) => { //doublecheck syntax
    switch (message.message) {
      case messageType.scrapePage:
        //await chrome.storage.local.set(message);
        console.log(message);
        sendResponse({
          status: chrome.runtime.lastError ? 'error': 'page scraped'
        });
        break;
      case messageType.downloadContentJSON:
        //await chrome.storage.local.set(message);
        console.log(message);
        sendResponse({
          status: chrome.runtime.lastError ? 'error': 'content downloaded'
        });
        break;
      default:
        sendResponse(null);
    }
});