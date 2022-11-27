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

interface ICardData {
	id: string;
	name: string;
	description: string | number;
	boosterPack: BoosterPack;
	cardType: string | number;
	rarity: Rarity;
	imgLink: string | URL;
}

interface IBoosterPackData {
	id: string;
	name: string;
	unlockCondition: string;
	imgLink: string | URL;
	cardIds: string[];
	redeemed: number;
}

//TODO: need to check if this exists in all cases where I'd be manipulating it in storage,
// if not, instantiate and then manip/save
interface IContentStorageData {
	cards: ICardData[];
	boosterPacks: IBoosterPackData[];
	starterDecks: IBoosterPackData[];
	weeklySets: IBoosterPackData[];
	magazines: IBoosterPackData[];
	grandpaCupSets: IBoosterPackData[];
}

// Useful Constants
const xpathUnlockCondition =
	'//th[contains(text(), "Introduction")]/../following-sibling::tr/td/p';
const xpathCardDescriptionEDS =
	'//b[contains(text(),"Card descriptions")]/..//*/tbody/tr[1]/th/div/i/a[contains(text(),"The Eternal Duelist Soul")]';
const xpathCardDescription =
	'//b[contains(text(),"Card descriptions")]/..//*/tbody/tr[1]/th/div[contains(text(),"English")]';
const xpathCardType =
	'//a[contains(text(),"Card type")]/../following-sibling::td/a';
const headingId = '#firstHeading';
const packSuffix = '(EDS-BP)';
const packImg = 'div > figure > a.image';
const packImgLauncherSpider = 'div > aside > figure > a.image';
const cardDescriptionTd = 'tr:nth-child(3) > td';
const ygoFandomSite = 'https://yugioh.fandom.com/wiki/';
const launcherSpiderBoosterPage =
	'https://yugioh.fandom.com/wiki/Launcher_Spider_(EDS-BP)';
const localStorageKey = 'Yu-Gi-Oh EDS Scraper Data';

window.onload = async () => {
	const button = document.createElement('button');
	button.id = 'scrapePage';
	button.textContent = 'Scrape Page';

	document.querySelector(headingId).parentElement.append(button);

	button.addEventListener('click', () => {
		checkAndScrapeBoosterPage();
		button.textContent = 'Page Scraped!';
		button.disabled = true;
	});

	const extensionStorage = (await chrome.storage.local.get(
		localStorageKey,
	)) as IContentStorageData;
	if (!extensionStorage?.cards?.length) {
		chrome.storage.local.set(
			{ localStorageKey: {} as IContentStorageData },
			() => {
				console.log(
					'Created new empty ContentStorageData object for Yu-Gi-Oh EDS Scraper',
				);
			},
		);
	}
};

function checkAndScrapeBoosterPage() {
	if (document.location.href === launcherSpiderBoosterPage) {
		scrapeLauncherSpiderBoosterPage();
	} else {
		scrapeBoosterPage();
	}
}

// this should probaly be future proofed, in the event other pages follow suit...
async function scrapeLauncherSpiderBoosterPage() {
	const boosterCardRows = document
		.getElementById('Top_table')
		.getElementsByTagName('tbody')[0].children;
	const boosterName = BoosterPack.LauncherSpider;
	const unlockCondition =
		'The Launcher Spider Booster Pack is unlocked by defeating Mai Valentine 20 times';

	const img = document.querySelector(
		packImgLauncherSpider,
	) as HTMLAnchorElement;
	const imgLink = img.href;
	const cardDataCollection: ICardData[] = [];

	for (let i = 0; i < boosterCardRows.length; i++) {
		const currentCardRow = (boosterCardRows.item(i) as HTMLElement).children;
		const cardName = (currentCardRow.item(0) as HTMLElement)?.innerText
			.trim()
			.replace(/\"/g, '');
		const cardRarity =
			(currentCardRow.item(1) as HTMLElement)?.innerText === Rarity.Common
				? Rarity.Common
				: Rarity.Rare;
		const cardURL = ygoFandomSite.concat(cardName.replace(/ /g, '_'));

		const cardData = await getCardInfo(
			cardName,
			cardURL,
			boosterName,
			cardRarity,
		);

		cardDataCollection.push(cardData);
	}

	console.log(boosterName);
	console.log(unlockCondition);
	console.log(imgLink);
	console.log(cardDataCollection);
}

async function scrapeBoosterPage() {
	const cardDataCollection: ICardData[] = [];
	const cardIds: string[] = [];

	const contentStorageData = (await chrome.storage.local.get(
		localStorageKey,
	)) as IContentStorageData;

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

	const xpathDeckDetails =
		'//th[contains(text(), "Deck Details")]/../following-sibling::tr/td';
	const deckDetails = (
		evaluateElement(document, xpathDeckDetails) as HTMLElement
	)?.children;

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

				const cardData = await getCardInfo(
					cardName,
					cardURL,
					boosterName as BoosterPack,
					cardRarity as Rarity,
				);

				cardDataCollection.push(cardData);
				cardIds.push(cardData.id);
			}
		}
	}

	if (!contentStorageData?.cards?.length) {
		contentStorageData.cards = [];
	}
	if (!contentStorageData?.boosterPacks?.length) {
		contentStorageData.boosterPacks = [];
	}

	//FIXME: push isn't working right, switch to concat and do something like check val ?? new val concatted or something idk
	contentStorageData.cards.push(...cardDataCollection);
	contentStorageData.boosterPacks.push({
		id: boosterName,
		name: boosterName,
		imgLink: imgLink,
		redeemed: 0,
		unlockCondition: unlockCondition,
		cardIds: cardIds,
	});
	console.log(contentStorageData);

	//const updatedContentStorageData = contentStorageData;

	//TODO: need to add this to launcher spider
	chrome.storage.local.set(
		{
			localStorageKey: contentStorageData,
		},
		() => {
			console.log('localStorage updated');
		},
	);

	const extensionStorage = chrome.storage.local.get(
		localStorageKey,
		(data: IContentStorageData) => {
			console.log('got localStorage: ', data);
		},
	);
	console.log(extensionStorage);
}

function scrapeCardPage(
	pageDocument: Document,
	cardName: string,
	boosterPack: BoosterPack,
	rarity: Rarity,
) {
	//unique cardId given name and boosterPack
	const cardId = `${cardName}-${boosterPack}`;

	//get Card Description from DOM
	let descriptionNode = (
		evaluateElement(pageDocument, xpathCardDescriptionEDS) as Element
	)?.closest('tbody');
	let cardDescriptionElement = descriptionNode?.querySelector(
		cardDescriptionTd,
	) as HTMLElement;
	let cardDescription = cardDescriptionElement
		? cardDescriptionElement.innerText.trim()
		: -1;

	if (cardDescription === -1) {
		descriptionNode = (
			evaluateElement(pageDocument, xpathCardDescription) as Element
		)?.closest('tbody');
		console.log(descriptionNode);
		cardDescriptionElement = descriptionNode?.querySelector(
			cardDescriptionTd,
		) as HTMLElement;
		console.log(cardDescriptionElement);
		cardDescription = cardDescriptionElement
			? cardDescriptionElement.innerText.trim()
			: -1;
	}

	// get card type node on DOM
	const cardTypeElement = evaluateElement(
		pageDocument,
		xpathCardType,
	) as HTMLElement;
	const cardType = cardTypeElement ? cardTypeElement.innerText.trim() : -1;

	// TODO: need to get all the other card props

	return {
		id: cardId,
		name: cardName,
		description: cardDescription,
		boosterPack,
		cardType,
		rarity,
	} as ICardData;
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
	let cardData: ICardData;
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
