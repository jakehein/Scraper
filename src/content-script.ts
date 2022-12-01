// TODO: add button to this list to grab ALL cards in one loop? Maybe get images this way...
// https://yugioh.fandom.com/wiki/Gallery_of_Yu-Gi-Oh!_The_Eternal_Duelist_Soul_cards

//#region Enums
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
//#endregion

//#region Interfaces
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

interface IContentStorageData {
	cards: ICardData[];
	boosterPacks: IBoosterPackData[];
	starterDecks: IBoosterPackData[];
	weeklySets: IBoosterPackData[];
	magazines: IBoosterPackData[];
	grandpaCupSets: IBoosterPackData[];
}
//#endregion

//#region Useful Constants
const xpathUnlockCondition =
	'//th[contains(text(), "Introduction")]/../following-sibling::tr/td/p';
const xpathCardDescriptionEDS =
	'//b[contains(text(),"Card descriptions")]/..//*/tbody/tr[1]/th/div/i/a[contains(text(),"The Eternal Duelist Soul")]';
const xpathCardDescription =
	'//b[contains(text(),"Card descriptions")]/..//*/tbody/tr[1]/th/div[contains(text(),"English")]';
const xpathCardType =
	'//a[contains(text(),"Card type")]/../following-sibling::td/a';
const xpathDeckDetails =
	'//th[contains(text(), "Deck Details")]/../following-sibling::tr/td';
const headingId = '#firstHeading';
const packSuffix = '(EDS-BP)';
const packImg = 'div > figure > a.image';
const packImgLauncherSpider = 'div > aside > figure > a.image';
const cardDescriptionTd = 'tr:nth-child(3) > td';
const ygoFandomSite = 'https://yugioh.fandom.com/wiki/';
const launcherSpiderBoosterPage =
	'https://yugioh.fandom.com/wiki/Launcher_Spider_(EDS-BP)';
//#endregion

window.onload = async () => {
	const button = document.createElement('button');
	button.id = 'scrapePage';
	button.textContent = 'Scrape Page';

	button.addEventListener('click', () => {
		checkAndScrapeBoosterPage();
		disableScraperForPage(button);
	});

	//TODO: TEST, remove this
	//await chrome.storage.local.clear();

	checkBoosterPageStorage(button);

	document.querySelector(headingId).parentElement.append(button);
};

function checkBoosterPageStorage(button: HTMLButtonElement) {
	chrome.storage.local.get(
		'ygoKey',
		(extensionStorage: { ygoKey: IContentStorageData }) => {
			const storageDataInit = getNewContentStorageDataInstance();
			if (!extensionStorage?.ygoKey?.cards?.length) {
				chrome.storage.local.set({ ygoKey: storageDataInit }, () => {
					console.log(
						'Created new empty ContentStorageData object for Yu-Gi-Oh EDS Scraper',
					);
				});
			} else {
				//check if page has already been scraped
				const boosterName = getBoosterName();

				const isCurrentBoosterScraped =
					extensionStorage?.ygoKey?.boosterPacks?.find((pack) => {
						return pack.name === boosterName;
					});

				if (isCurrentBoosterScraped) {
					disableScraperForPage(button);
				}
			}
		},
	);
}

function getBoosterName() {
	const boosterNameElement = document.querySelector(headingId) as HTMLElement;
	const boosterName = boosterNameElement.innerText
		.replace(packSuffix, '')
		.trim();
	return boosterName;
}

function getNewContentStorageDataInstance() {
	return {
		cards: [],
		boosterPacks: [],
		starterDecks: [],
		weeklySets: [],
		magazines: [],
		grandpaCupSets: [],
	} as IContentStorageData;
}

async function getLocalStorage() {
	const localStorage = (await chrome.storage.local.get('ygoKey')) as {
		ygoKey: IContentStorageData;
	};
	return localStorage?.ygoKey;
}

async function setLocalStorage(contents: IContentStorageData) {
	await chrome.storage.local.set({
		ygoKey: contents,
	});
}

function disableScraperForPage(button: HTMLButtonElement) {
	button.textContent = 'Page Scraped!';
	button.disabled = true;
}

// this should probably be future proofed, in the event other pages follow suit...
function checkAndScrapeBoosterPage() {
	if (document.location.href === launcherSpiderBoosterPage) {
		scrapeLauncherSpiderBoosterPage();
	} else {
		scrapeBoosterPage();
	}
}

// this should probably be future proofed, in the event other pages follow suit...
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

function boosterPageContents() {
	const boosterName = getBoosterName();

	const unlockCondition = (
		evaluateElement(document, xpathUnlockCondition) as HTMLElement
	)?.innerText;

	const img = document.querySelector(packImg) as HTMLAnchorElement;
	const imgLink = img.href;

	const deckDetails = (
		evaluateElement(document, xpathDeckDetails) as HTMLElement
	)?.children;

	return { boosterName, unlockCondition, imgLink, deckDetails };
}

async function getCardDetails(
	cardIds: string[],
	pageContentStorageData: IContentStorageData,
	boosterName: string,
	deckDetails: HTMLCollection,
) {
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

				pageContentStorageData.cards.push(cardData);
				cardIds.push(cardData.id);
			}
		}
	}
}

async function scrapeBoosterPage() {
	const cardIds: string[] = [];
	const pageContentStorageData = getNewContentStorageDataInstance();

	const storageContentStorageData = await getLocalStorage();

	const { boosterName, unlockCondition, imgLink, deckDetails } =
		boosterPageContents();

	// update cardIds and pageContentStorageData
	await getCardDetails(
		cardIds,
		pageContentStorageData,
		boosterName,
		deckDetails,
	);

	pageContentStorageData.boosterPacks.push({
		id: boosterName,
		name: boosterName,
		imgLink: imgLink,
		redeemed: 0,
		unlockCondition: unlockCondition,
		cardIds: cardIds,
	});

	if (
		!storageContentStorageData?.cards?.length &&
		!storageContentStorageData?.boosterPacks?.length
	) {
		await setLocalStorage(pageContentStorageData);
	} else {
		const updatedContentStorageData: IContentStorageData = {
			...storageContentStorageData,
			cards: storageContentStorageData.cards.concat(
				pageContentStorageData.cards,
			),
			boosterPacks: storageContentStorageData.boosterPacks.concat(
				pageContentStorageData.boosterPacks,
			),
		};
		await setLocalStorage(updatedContentStorageData);
	}

	// print to console new storage data contents
	chrome.storage.local.get(
		'ygoKey',
		(extensionStorage: { ygoKey: IContentStorageData }) => {
			console.log('extensionStorage:', extensionStorage?.ygoKey);
		},
	);
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
