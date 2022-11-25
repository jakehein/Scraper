// TODO: add button to this list to grab ALL cards in one loop? Maybe get images this way...
// https://yugioh.fandom.com/wiki/Gallery_of_Yu-Gi-Oh!_The_Eternal_Duelist_Soul_cards

enum BoosterPack {
	DarkMagician = 'Dark Magician',
	MysticalElf = 'Mystical Elf',
	RedEyesBDragon = 'Red-Eyes B. Dragon',
	JudgeMan = 'Judge Man',
	BlueEyesWhiteDragon = 'Blue-Eyes White Dragon',
	Exodia = 'Exodia',
	CyberHarpie = 'Cyber Harpie',
	TigerAxe = 'Tiger Axe',
	GateGuardian = 'Gate Guardian',
	GeminiElf = 'Gemini Elf',
	LauncherSpider = 'Launcher Spider',
	GreatMoth = 'Great Moth',
	Garoozis = 'Garoozis',
	Relinquished = 'Relinquished',
	BattleOx = 'Battle Ox',
	BlueEyesToonDragon = 'Blue-Eyes Toon Dragon',
	BlackLusterSoldier = 'Black Luster Soldier',
	BlueEyesUltimateDragon = 'Blue-Eyes Ultimate Dragon',
	BlueMilleniumPuzzle = 'Blue Millenium Puzzle',
	MilleniumEye = 'Millenium Eye',
	BusterBlader = 'Buster Blader',
	GreenMilleniumPuzzle = 'Green Millenium Puzzle',
	MultiColoredMilleniumPuzzle = 'Multi-Colored Millenium Puzzle',
}

enum Rarity {
	Rare = 'Rare',
	Common = 'Common',
}

interface CardData {
	cardId: string;
	cardName: string;
	cardDescription: string | number;
	boosterPack: BoosterPack;
	cardType: string | number;
	rarity: Rarity;
}

// Useful Constants
const xpathUnlockCondition =
	'//th[contains(text(), "Introduction")]/../following-sibling::tr/td/p';
const xpathDescription =
	'//b[contains(text(),"Card descriptions")]/..//*/tbody/tr[1]/th/div/i/a[contains(text(),"The Eternal Duelist Soul")]';
const xpathCardType =
	'//a[contains(text(),"Card type")]/../following-sibling::td/a';
const headingId = '#firstHeading';
const packSuffix = '(EDS-BP)';
const packImg = 'div > figure > a.image';
const cardDescriptionTd = 'tr:nth-child(3) > td';
const ygoFandomSite = 'https://yugioh.fandom.com/wiki/';
const launcherSpiderBoosterPage =
	'https://yugioh.fandom.com/wiki/Launcher_Spider_(EDS-BP)';

window.onload = () => {
	const button = document.createElement('button');
	button.id = 'scrapePage';
	button.textContent = 'Scrape Page';

	document.querySelector(headingId).parentElement.append(button);

	button.addEventListener('click', () => {
		//scrapePage();
		checkAndScrapeBoosterPage();
		//scrapeBoosterPage();
		button.textContent = 'Page Scraped!';
		button.disabled = true;
	});
};

function checkAndScrapeBoosterPage() {
	if (document.location.href === launcherSpiderBoosterPage) {
		scrapeLauncherSpiderBoosterPage();
	} else {
		scrapeBoosterPage();
	}
}

function scrapeLauncherSpiderBoosterPage() {}

// FOR TESTING...
// https://yugioh.fandom.com/wiki/Dark_Magician_(EDS-BP)
async function scrapeBoosterPage() {
	// booster pack name
	const boosterNameElement = document.querySelector(headingId) as HTMLElement;
	const boosterName = boosterNameElement.innerText
		.replace(packSuffix, '')
		.trim();

	// booster unlock condition
	const unlockCondition = (
		evaluateElement(document, xpathUnlockCondition) as HTMLElement
	)?.innerText;

	const img = document.querySelector(packImg) as HTMLAnchorElement;
	const imgLink = img.href;

	//TODO: need to get the rarity of the card from the page here

	// const xpathUnlockCondition =
	// '//th[contains(text(), "Introduction")]/../following-sibling::tr/td/p';

	// deck details tr
	//const xpathDeckDetails = '//*[@id="mw-content-text"]/div/table[2]/tbody/tr[5]/th';
	//TODO: check this against blue-eyes ultimate dragon booster page
	const xpathDeckDetails =
		'//th[contains(text(), "Deck Details")]/../following-sibling::tr/td';
	const deckDetails = (
		evaluateElement(document, xpathDeckDetails) as HTMLElement
	)?.children;

	const cardDataCollection: CardData[] = [];

	for (let i = 0; i < deckDetails.length - 1; i++) {
		const pElement = deckDetails.item(i);
		const ulElement = deckDetails.item(i + 1);
		const cardsCollection = ulElement.children;

		if (pElement.tagName === 'P' && ulElement.tagName === 'UL') {
			const cardRarity = (pElement as HTMLElement).innerText.trim();
			for (let j = 0; j < cardsCollection.length; j++) {
				const currentCard = cardsCollection.item(j) as HTMLElement;
				const cardName = currentCard.innerText.trim();
				const cardURL = (currentCard.firstElementChild as HTMLAnchorElement)
					?.href;

				if (!Object.values(Rarity).includes(cardRarity as Rarity)) {
					console.log(
						`Rarity ${cardRarity} is not an accepted Rarity type. Big oops on the devs part. Bad Dev, Bad!`,
					);
					return;
				} else if (
					!Object.values(BoosterPack).includes(boosterName as BoosterPack)
				) {
					console.log(
						`BoosterPack ${boosterName} is not an accepted BoosterPack type. Big oops on the devs part. Bad Dev, Bad!`,
					);
					return;
				}

				//BOOSETER TEST
				const cardData = await getCardInfo(
					cardName,
					cardURL,
					boosterName as BoosterPack,
					cardRarity as Rarity,
				);

				cardDataCollection.push(cardData);
			}
		}
	}
	console.log(boosterName);
	console.log(unlockCondition);
	console.log(imgLink);
	console.log(cardDataCollection);
	//console.log(boosterName, '\n', unlockCondition, '\n', imgLink, '\n');

	//const cardRarity: string = 'Rare';
	//TODO: need to get the actual card URL here
	//const cardURL: string = 'https://yugioh.fandom.com/wiki/Beast_Fangs';
}

// TODO: Thinking I'll hit this from the booster pack page, passing in the pack info to make a card
// The cardID might be "boosterNameCardName" or something
function scrapeCardPage(
	pageDocument: Document,
	cardName: string,
	boosterPack: BoosterPack,
	rarity: Rarity,
) {
	//get Card Name from header of DOM
	//const cardNameElement = pageDocument.querySelector(headingId) as HTMLElement;
	//const cardName = cardNameElement ? cardNameElement.innerText.trim() : -1;

	//get Card Description from DOM
	const descriptionNode = (
		evaluateElement(pageDocument, xpathDescription) as Element
	)?.closest('tbody');
	const cardDescriptionElement = descriptionNode?.querySelector(
		cardDescriptionTd,
	) as HTMLElement;
	const cardDescription = cardDescriptionElement
		? cardDescriptionElement.innerText.trim()
		: -1;

	// get card type node on DOM
	const cardTypeElement = evaluateElement(
		pageDocument,
		xpathCardType,
	) as HTMLElement;
	const cardType = cardTypeElement ? cardTypeElement.innerText.trim() : -1;
	const cardId = `${cardName}-${boosterPack}`;

	return { cardId, cardName, cardDescription, boosterPack, cardType, rarity };
}

//TODO: decide if this should be called once per string or pass all strings of card into this one time
function errorHandleStrings(
	cardName: string | number,
	cardDescription: string | number,
	cardType: string | number,
): {
	cardName: string;
	cardDescription: string;
	cardType: string;
} {
	if (cardName === -1 || cardDescription === -1 || cardType === -1) {
		console.log(
			'Error with card: ',
			cardName,
			' description: ',
			cardDescription,
			' cardType: ',
			cardType,
		);
	}

	return {
		cardName: (cardName as string).trim(),
		cardDescription: (cardDescription as string).trim(),
		cardType: (cardType as string).trim(),
	};
}

function evaluateElement(pageDocument: Document, xpath: string) {
	return pageDocument.evaluate(
		xpath,
		pageDocument,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null,
	).singleNodeValue;
}

async function getCardInfo(
	cardName: string,
	url: RequestInfo | URL,
	boosterPackName: BoosterPack,
	rarity: Rarity,
) {
	let cardData: CardData;
	await fetch(url)
		.then((resp) => resp.text())
		.then((result) => {
			cardData = scrapeCardPage(
				new DOMParser().parseFromString(result, 'text/html'),
				cardName,
				boosterPackName,
				rarity,
			);
		})
		.catch((e) => console.log(`Card Info could not be retrieved: ${e}`));
	return cardData;
}

function downloadImage(url: RequestInfo | URL, name: string) {
	fetch(url)
		.then((resp) => resp.blob())
		.then((blob) => {
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			// the filename you want
			a.download = name;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		})
		.catch(() => console.log('An error sorry'));
}
