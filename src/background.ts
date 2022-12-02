let cardImgDoc: string;
chrome.runtime.onInstalled.addListener(async () => {
	console.log('installed');
	// https://yugioh.fandom.com/wiki/Gallery_of_Yu-Gi-Oh!_The_Eternal_Duelist_Soul_cards
	//to this so it's done before anything else is loaded. save lots of time
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'cache') {
		console.log('request.message is cache', cardImgDoc);
		sendResponse({ response: cardImgDoc });
	} else {
		console.log('request.message', request.message);
		cardImgDoc = request.message;
		sendResponse({ response: cardImgDoc });
	}
});
