////////////////////
// enable extension only on valid urls
// button should send message to backend,
// backend sends dom contents back to frontend?
// dom contents are saved to localStorage?
// dom contents are saved as json object?

const messageType = {
  scrapePage: 'scrapePage',
  downloadContentJSON: 'downloadContentJSON',
};

const scrapedHtml = document.getElementById("scraper");
const downloadedContents = document.getElementById("contents");

scrapedHtml.addEventListener('click', async () => {
  chrome.runtime.sendMessage({ message: messageType.scrapePage }, (response) => {
    console.log(response.status);
  });
});

downloadedContents.addEventListener('click', async () => {
  chrome.runtime.sendMessage({ message: messageType.downloadContentJSON }, (response) => {
    console.log(response.status);
  });
});

////////////////////
// might keep this script

// const scrapedHtml = document.getElementById("scraper");
// const ygoWiki = 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_The_Eternal_Duelist_Soul';

// scrapedHtml.addEventListener('click', async () => {
//   const queryOptions = {active: true, currentWindow: true};
  
//   let [tab] = await chrome.tabs.query(queryOptions);
  
//   console.log(tab);
//   if(!tab.url.includes(ygoWiki)) {
//     scrapeAction(false);
//     console.log(`Nope. Go to ${ygoWiki} to start scraping!`);
//   }
//   else {
//     // chrome.scripting.executeScript({
//     //   target: {tabId: tab.id },
//     //   func: 
//     // });
//     chrome.storage.local.get("")
//     scrapeAction(true);
//     console.log('Scraped! Proceed to the next.');
//   }
// });

// function scrapeAction(isScraped) {
//   if(isScraped) {
//     scrapedHtml.innerHTML = 'Scraped! Proceed to the next card.';
//   }
//   else {
//     scrapedHtml.innerHTML = `Nope. Go to <p><a href="${ygoWiki}">The EDS Site<a><p> to start scraping!`;
//   }
//   scrapedHtml.disableButton = true;
// }
