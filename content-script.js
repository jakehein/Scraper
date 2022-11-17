// testing content-script functionality
// window.onload = document.querySelector(".page-header__title-wrapper").append("This is the Page Header");

chrome.runtime.onMessage.addListener((message) => {
  if (message.message === 'test') {
    console.log('content script')  
    chrome.runtime.sendMessage({
      "message": 'test message from content script'
    });
  }
});
