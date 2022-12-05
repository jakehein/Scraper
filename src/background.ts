let cardImgDoc: string;
chrome.runtime.onInstalled.addListener(async () => {
	console.log('installed');
	// https://yugioh.fandom.com/wiki/Gallery_of_Yu-Gi-Oh!_The_Eternal_Duelist_Soul_cards
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'cache') {
		sendResponse({ response: cardImgDoc });
	} else {
		cardImgDoc = request.message;
		sendResponse({ response: cardImgDoc });
	}
});
