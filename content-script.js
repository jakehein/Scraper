chrome.runtime.onMessage.addListener((message) => {
  if (message.message === 'test') {
    chrome.runtime.sendMessage({
      "message": 'test message from content script'
    });
  }
});
