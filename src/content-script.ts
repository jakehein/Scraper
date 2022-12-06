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
	MultiColoredMilleniumPuzzle = 'Multi-colored Millenium Puzzle',
	weeklyYuGiOh1 = 'Set 1',
	weeklyYuGiOh2 = 'Set 2',
	Magazine = 'Yu-Gi-Oh! Magazine',
	GrandpaCupQualifying = 'Qualifying Round',
	GrandpaCupFinal = 'Final',
}

enum Rarity {
	Rare = 'Rare',
	Common = 'Common',
}

enum CardType {
	Monster = 'Monster',
	Spell = 'Spell',
	Trap = 'Trap',
}

enum Property {
	Normal = 'Normal',
	Field = 'Field',
	QuickPlay = 'Quick-Play',
	Ritual = 'Ritual',
	Continuous = 'Continuous',
	Equip = 'Equip',
	Counter = 'Counter',
}

enum MonsterType {
	Normal = 'Normal',
	Effect = 'Effect',
	Fusion = 'Fusion',
	Ritual = 'Ritual',
	Aqua = 'Aqua',
	Beast = 'Beast',
	BeastWarrior = 'Beast-Warrior',
	Dinosaur = 'Dinosaur',
	DivineBeast = 'Divine-Beast',
	Dragon = 'Dragon',
	Fairy = 'Fairy',
	Fiend = 'Fiend',
	Fish = 'Fish',
	Insect = 'Insect',
	Machine = 'Machine',
	Plant = 'Plant',
	Pyro = 'Pyro',
	Reptile = 'Reptile',
	Rock = 'Rock',
	SeaSerpent = 'Sea Serpent',
	Spellcaster = 'Spellcaster',
	Thunder = 'Thunder',
	Warrior = 'Warrior',
	WingedBeast = 'Winged Beast',
	Zombie = 'Zombie',
}

enum Attribute {
	Dark = 'DARK',
	Divine = 'DIVINE',
	Earth = 'EARTH',
	Fire = 'FIRE',
	Light = 'LIGHT',
	Water = 'WATER',
	Wind = 'WIND',
}
//#endregion

//#region Interfaces
interface ICardData {
	id: string;
	name: string;
	description: string;
	boosterPack: BoosterPack;
	cardType: CardType;
	rarity: Rarity;
	imgLink: RequestInfo | URL;
	isFusionMonster: boolean;
	isRitualMonster: boolean;
	property?: Property;
	passcode?: string;
	monsterTypes?: MonsterType[];
	atk?: string;
	def?: string;
	attribute?: Attribute;
	level?: number;
	ritualSpellCardName?: string;
	ritualMonsterRequired?: string;
	fusionMaterials?: string[];
}

interface IBoosterPackData {
	id: string;
	name: string;
	unlockCondition?: string;
	imgLink?: string | URL;
	cardIds: string[];
}

interface IContentStorageData {
	cards: ICardData[];
	boosterPacks: IBoosterPackData[];
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
const xpathType = '//a[contains(text(),"Type")]/../following-sibling::td';
const xpathTypes = '//a[contains(text(),"Types")]/../following-sibling::td';
const xpathAtkDef = '//a[contains(text(),"ATK")]/../following-sibling::td';
const xpathAttribute =
	'//a[contains(text(),"Attribute")]/../following-sibling::td';
const xpathLevel = '//a[contains(text(),"Level")]/../following-sibling::td';
const xpathProperty =
	'//a[contains(text(),"Property")]/../following-sibling::td';
const xpathPasscode =
	'//a[contains(text(),"Passcode")]/../following-sibling::td';
const xpathRitualSpellCardRequired =
	'//a[contains(text(),"Ritual Spell Card")]/../following-sibling::td';
const xpathRitualMonsterRequired =
	'//a[contains(text(),"Ritual Monster")]/../following-sibling::td';
const xpathDeckDetails =
	'//th[contains(text(), "Deck Details")]/../following-sibling::tr/td';
const xpathFusionMaterials =
	'//th[contains(text(), "Materials")]/following-sibling::td';
const xpathConditionalBoosters =
	'//*[@id="mw-content-text"]/div[@class="mw-parser-output"]';
const headingId = '#firstHeading';
const packSuffix = '(EDS-BP)';
const packImg = 'div > figure > a.image';
const cardImg = 'td.cardtable-cardimage > a.image';
const packImgLauncherSpider = 'div > aside > figure > a.image';
const cardDescriptionTd = 'tr:nth-child(3) > td';
const ygoFandomSite = 'https://yugioh.fandom.com/wiki/';
const launcherSpiderBoosterPage =
	'https://yugioh.fandom.com/wiki/Launcher_Spider_(EDS-BP)';
const weeklyYuGiOhPage = 'https://yugioh.fandom.com/wiki/Weekly_Yu-Gi-Oh!';
const yuGiOhMagazinePage = 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh!_Magazine';
const grandpaCupPage = 'https://yugioh.fandom.com/wiki/Grandpa_Cup';

//#endregion

window.onload = async () => {
	const button = document.createElement('button');
	button.id = 'scrapePage';
	button.textContent = 'Scrape Page';

	button.addEventListener('click', () => {
		checkPageToScrape();
		disableScraperForPage(button);
	});

	//TODO: TEST, remove this
	await chrome.storage.local.clear();

	checkBoosterPageStorage(button);

	document.querySelector(headingId).parentElement.append(button);

	//cache card image DOM in service-worker
	chrome.runtime.sendMessage({ message: 'cache' }, async (response) => {
		if (!response.response) {
			chrome.runtime.sendMessage(
				{
					message: await getCardImgDocument(),
				},
				(resp) => {
					cardImgDocument = new DOMParser().parseFromString(
						resp.response,
						'text/html',
					);
				},
			);
		} else {
			cardImgDocument = new DOMParser().parseFromString(
				response.response,
				'text/html',
			);
		}
		document.querySelector(headingId).parentElement.append(button);
	});
};

//#region Common Code
let cardImgDocument: Document;

function evaluateElement(pageDocument: Document, xpath: string) {
	return pageDocument.evaluate(
		xpath,
		pageDocument,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null,
	).singleNodeValue;
}

async function getCardImgDocument() {
	let domDoc: string;
	await fetch(
		'https://yugioh.fandom.com/wiki/Gallery_of_Yu-Gi-Oh!_The_Eternal_Duelist_Soul_cards',
	)
		.then((resp) => resp.text())
		.then((result) => {
			domDoc = result;
		})
		.catch((e) => console.log(`Card Info could not be retrieved: ${e}`));
	return domDoc;
}

async function getCardInfo(
	cardName: string,
	url: RequestInfo | URL,
	cardImgURL: RequestInfo | URL,
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
				cardImgURL,
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

function getCardDescription(pageDocument: Document, xpath: string) {
	const descriptionNode = (
		evaluateElement(pageDocument, xpath) as Element
	)?.closest('tbody');
	const cardDescriptionElement = descriptionNode?.querySelector(
		cardDescriptionTd,
	) as HTMLElement;
	const cardDescription = cardDescriptionElement
		? cardDescriptionElement.innerText.trim()
		: '';
	return cardDescription;
}

function getElementText(pageDocument: Document, xpath: string) {
	const element = evaluateElement(pageDocument, xpath) as HTMLElement;
	const elementText = element ? element.innerText.trim() : undefined;
	return elementText;
}

function scrapeCardPage(
	pageDocument: Document,
	cardName: string,
	boosterPack: BoosterPack,
	rarity: Rarity,
	cardImgURL: RequestInfo | URL,
) {
	const cardData: ICardData = {
		id: `${cardName}-${boosterPack}`,
		name: cardName,
		description: '',
		boosterPack: boosterPack,
		cardType: CardType.Monster,
		rarity: rarity,
		imgLink: cardImgURL,
		isFusionMonster: false,
		isRitualMonster: false,
	};

	cardData.description = getCardDescription(
		pageDocument,
		xpathCardDescriptionEDS,
	);

	if (!cardData.description) {
		cardData.description = getCardDescription(
			pageDocument,
			xpathCardDescription,
		);
	}

	if (!cardData.imgLink) {
		const img = document.querySelector(
			packImgLauncherSpider,
		) as HTMLAnchorElement;
		cardData.imgLink = img.href;
	}

	const cardType = getElementText(pageDocument, xpathCardType);

	cardData.cardType = cardType as CardType;

	switch (cardType) {
		case CardType.Monster:
			const types = getElementText(pageDocument, xpathTypes);
			if (types) {
				cardData.monsterTypes = types.split(/ \/ /g) as MonsterType[];
			} else {
				cardData.monsterTypes = [
					getElementText(pageDocument, xpathType) as MonsterType,
				];
			}
			if (cardData.monsterTypes?.includes(MonsterType.Ritual)) {
				cardData.ritualSpellCardName = getElementText(
					pageDocument,
					xpathRitualSpellCardRequired,
				).replace(/\"/g, '');
				if (cardData.ritualSpellCardName === 'Black Magic Ritual') {
					cardData.ritualSpellCardName = 'Dark Magic Ritual';
				}
			} else if (cardData.monsterTypes?.includes(MonsterType.Fusion)) {
				cardData.fusionMaterials = getElementText(
					pageDocument,
					xpathFusionMaterials,
				)
					.split(/\+/g)
					.map((x) => x.replace(/\"/g, '').trim());
			}
			cardData.isFusionMonster = cardData.monsterTypes.includes(
				MonsterType.Fusion,
			);
			cardData.isRitualMonster = cardData.monsterTypes.includes(
				MonsterType.Ritual,
			);
			const atkDef = getElementText(pageDocument, xpathAtkDef).split(/ \/ /g);
			cardData.atk = atkDef[0];
			cardData.def = atkDef[1];
			cardData.attribute = getElementText(
				pageDocument,
				xpathAttribute,
			) as Attribute;
			cardData.level = parseInt(getElementText(pageDocument, xpathLevel));
			break;
		case CardType.Spell:
		case CardType.Trap:
			cardData.property = getElementText(
				pageDocument,
				xpathProperty,
			) as Property;
			if (cardData.property === Property.Ritual) {
				cardData.ritualMonsterRequired = getElementText(
					pageDocument,
					xpathRitualMonsterRequired,
				).replace(/\"/g, '');
			}
			break;
		default:
			break;
	}

	cardData.passcode = getElementText(pageDocument, xpathPasscode);

	return cardData;
}

function getCardImgXPath(cardText: string, isAltArtwork: boolean) {
	let xpathCardImg = `//a[contains(text(), "${cardText}")]`;
	if (isAltArtwork) {
		xpathCardImg = xpathCardImg.concat(
			'/../i/a[contains(text(), "Alternate artwork")]/..',
		);
	}
	xpathCardImg = xpathCardImg.concat('/../preceding-sibling::div/div/a/img');
	return xpathCardImg;
}

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
	const boosterName = getHeadingText().replace(packSuffix, '').trim();
	return boosterName;
}

function getHeadingText() {
	const headingElement = document.querySelector(headingId) as HTMLElement;
	return headingElement.innerText;
}

function getNewContentStorageDataInstance() {
	return {
		cards: [],
		boosterPacks: [],
	} as IContentStorageData;
}

async function getLocalStorage() {
	const localStorage = (await chrome.storage.local.get('ygoKey')) as {
		ygoKey: IContentStorageData;
	};
	return localStorage?.ygoKey;
}

async function setLocalStorage(contents: IContentStorageData) {
	chrome.storage.local.set(
		{
			ygoKey: contents,
		},
		() => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
			} else {
				alert('Page has successfully been scraped!');
			}
		},
	);
}

function disableScraperForPage(button: HTMLButtonElement) {
	button.textContent = 'Page Scraped!';
	button.disabled = true;
}

function checkPageToScrape() {
	if (document.location.href === launcherSpiderBoosterPage) {
		scrapeLauncherSpiderBoosterPage();
	} else if (document.location.href === weeklyYuGiOhPage) {
		scrapeWeeklyAndGrandpaCupYuGiOhPage();
	} else if (document.location.href === yuGiOhMagazinePage) {
		scrapeYuGiOhMagazinePage();
	} else if (document.location.href === grandpaCupPage) {
		scrapeWeeklyAndGrandpaCupYuGiOhPage();
	} else {
		scrapeGeneralBoosterPage();
	}
}

async function pushCardInfo(
	cardName: string,
	boosterName: string,
	cardRarity: string,
	cardURL: string,
	pageContentStorageData: IContentStorageData,
	cardIds: string[],
	cardHasAlternateArtwork: boolean,
) {
	const cardImgURL = (
		evaluateElement(
			cardImgDocument,
			getCardImgXPath(cardName, cardHasAlternateArtwork),
		) as HTMLImageElement
	)?.dataset.src;
	if (!cardImgURL) {
		console.log('cardName is bunked', cardName);
	}

	if (!Object.values(Rarity).includes(cardRarity as Rarity)) {
		console.log(
			`Rarity ${cardRarity} is not an accepted Rarity type. Big oops on the devs part. Bad Dev, Bad!`,
		);
		return;
	} else if (!Object.values(BoosterPack).includes(boosterName as BoosterPack)) {
		console.log(
			`BoosterPack ${boosterName} is not an accepted BoosterPack type. Big oops on the devs part. Bad Dev, Bad!`,
		);
		return;
	}

	const cardData = await getCardInfo(
		cardName,
		cardURL,
		cardImgURL,
		boosterName as BoosterPack,
		cardRarity as Rarity,
	);

	pageContentStorageData.cards.push(cardData);
	cardIds.push(cardData.id);
}

async function updateContentLocalStorageData(
	boosterName: string,
	cardIds: string[],
	pageContentStorageData: IContentStorageData,
	storageContentStorageData: IContentStorageData,
	imgLink?: string,
	unlockCondition?: string,
) {
	pageContentStorageData.boosterPacks.push({
		id: boosterName,
		name: boosterName,
		imgLink: imgLink,
		unlockCondition: unlockCondition,
		cardIds: cardIds,
	});

	if (
		!storageContentStorageData?.cards?.length &&
		!storageContentStorageData?.boosterPacks?.length
	) {
		setLocalStorage(pageContentStorageData);
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
		setLocalStorage(updatedContentStorageData);
	}

	// print to console new storage data contents
	chrome.storage.local.get(
		'ygoKey',
		(extensionStorage: { ygoKey: IContentStorageData }) => {
			console.log('extensionStorage:', extensionStorage?.ygoKey);
		},
	);
}

async function getCommonVars(packImgPath?: string) {
	const cardIds: string[] = [];
	const pageContentStorageData = getNewContentStorageDataInstance();
	const storageContentStorageData = await getLocalStorage();
	let boosterName = undefined;
	let imgLink = undefined;
	if (packImgPath === packImgLauncherSpider) {
		boosterName = getBoosterName();
		imgLink = (document.querySelector(packImgPath) as HTMLAnchorElement).href;
	}

	return {
		cardIds,
		pageContentStorageData,
		storageContentStorageData,
		boosterName,
		imgLink,
	};
}
//#endregion

//#region Booster Packs
//#region Edge-Case Launcher Spider BP
async function getLauncherSpiderBoosterPackCardDetails(
	cardIds: string[],
	pageContentStorageData: IContentStorageData,
	boosterName: string,
	boosterCardRows: HTMLCollection,
) {
	for (let i = 0; i < boosterCardRows.length; i++) {
		const currentCardRow = (boosterCardRows.item(i) as HTMLElement).children;
		let cardName = (currentCardRow.item(0) as HTMLElement)?.innerText
			.trim()
			.replace(/\"/g, '');

		const cardRarity =
			(currentCardRow.item(1) as HTMLElement)?.innerText === Rarity.Common
				? Rarity.Common
				: Rarity.Rare;
		const cardURL = ygoFandomSite.concat(cardName.replace(/ /g, '_'));

		if (cardName.endsWith(' 1')) {
			cardName = cardName.replace(' 1', ' #1');
		} else if (cardName.endsWith(' 2')) {
			cardName = cardName.replace(' 2', ' #2');
		}

		await pushCardInfo(
			cardName,
			boosterName,
			cardRarity,
			cardURL,
			pageContentStorageData,
			cardIds,
			false,
		);
	}
}

async function scrapeLauncherSpiderBoosterPage() {
	const {
		cardIds,
		pageContentStorageData,
		storageContentStorageData,
		boosterName,
		imgLink,
	} = await getCommonVars(packImgLauncherSpider);

	const boosterCardRows = document
		.getElementById('Top_table')
		.getElementsByTagName('tbody')[0].children;
	const unlockCondition =
		'The Launcher Spider Booster Pack is unlocked by defeating Mai Valentine 20 times';

	await getLauncherSpiderBoosterPackCardDetails(
		cardIds,
		pageContentStorageData,
		boosterName,
		boosterCardRows,
	);

	await updateContentLocalStorageData(
		boosterName,
		cardIds,
		pageContentStorageData,
		storageContentStorageData,
		imgLink,
		unlockCondition,
	);
}
//#endregion

//#region General Booster Packs
function generalBoosterPageContents() {
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

async function getGeneralBoosterPackCardDetails(
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
				let cardName = currentCard.innerText.trim();
				let cardURL = (currentCard.firstElementChild as HTMLAnchorElement)
					?.href;
				if (cardURL.includes('#')) {
					cardURL = cardURL.replace(/#/g, '_');
				}

				const cardHasAlternateArtwork = cardName.includes('(Alternate artwork');
				if (cardHasAlternateArtwork || cardName.includes('(Primary')) {
					cardName = cardName.substring(0, cardName.indexOf(' (')).trim();
				}

				//Bunked card edge cases
				if (cardName === 'Anti-Spell Fragrance') {
					cardName = 'Anti-Magic Fragrance';
				} else if (cardName === 'Alligator Sword Dragon') {
					cardName = "Alligator's Sword Dragon";
				} else if (cardName === 'Tribute to the Doomed') {
					cardName = 'Tribute to The Doomed';
				} else if (cardName === 'Gift of the Mystical Elf') {
					cardName = 'Gift of The Mystical Elf';
				}

				await pushCardInfo(
					cardName,
					boosterName,
					cardRarity,
					cardURL,
					pageContentStorageData,
					cardIds,
					cardHasAlternateArtwork,
				);
			}
		}
	}
}

async function scrapeGeneralBoosterPage() {
	const { cardIds, pageContentStorageData, storageContentStorageData } =
		await getCommonVars();
	const { boosterName, unlockCondition, imgLink, deckDetails } =
		generalBoosterPageContents();

	await getGeneralBoosterPackCardDetails(
		cardIds,
		pageContentStorageData,
		boosterName,
		deckDetails,
	);

	await updateContentLocalStorageData(
		boosterName,
		cardIds,
		pageContentStorageData,
		storageContentStorageData,
		imgLink,
		unlockCondition,
	);
}
//#endregion
//#endregion

//#region Weekly YuGiOh and Grandpa Cup
async function scrapeWeeklyAndGrandpaCupYuGiOhPage() {
	const { pageContentStorageData, storageContentStorageData } =
		await getCommonVars();

	const setsCollection = (
		evaluateElement(document, xpathConditionalBoosters) as HTMLElement
	)?.children;

	const isGrandpaCupPage = getBoosterName() === 'Grandpa Cup';

	//get the two sets from the div collection, pruning the bad nodes
	//there's a more clever way to do this, but i'm tired and don't care
	for (
		let i = isGrandpaCupPage ? 2 : 3;
		i < setsCollection.length - 2;
		i += 6
	) {
		const set = (setsCollection.item(i) as HTMLElement).innerText.trim();
		const cardIds: string[] = [];
		console.log(setsCollection);
		for (let j = 0; j < 4; j += 2) {
			console.log(
				setsCollection.item(i + j + 1),
				setsCollection.item(i + j + 2),
			);
			const pElement = setsCollection.item(i + j + 1);
			const ulElement = isGrandpaCupPage
				? setsCollection.item(i + j + 2)
				: setsCollection.item(i + j + 2).firstElementChild;
			const cardsCollection = ulElement.children;

			if (pElement.tagName === 'P' && ulElement.tagName === 'UL') {
				const cardRarity = (pElement as HTMLElement).innerText.trim();
				for (let k = 0; k < cardsCollection.length; k++) {
					const currentCard = cardsCollection.item(k) as HTMLElement;
					let cardName = currentCard.innerText.trim();
					let cardURL = (currentCard.firstElementChild as HTMLAnchorElement)
						?.href;
					if (cardURL.includes('#')) {
						cardURL = cardURL.replace(/#/g, '_');
					}

					const cardHasAlternateArtwork =
						cardName.includes('(Alternate artwork');
					if (
						cardHasAlternateArtwork ||
						cardName.includes('(Primary') ||
						cardName.includes('(Promo')
					) {
						cardName = cardName.substring(0, cardName.indexOf(' (')).trim();
					}

					await pushCardInfo(
						cardName,
						set,
						cardRarity,
						cardURL,
						pageContentStorageData,
						cardIds,
						cardHasAlternateArtwork,
					);
				}
			}
		}

		await updateContentLocalStorageData(
			set,
			cardIds,
			pageContentStorageData,
			storageContentStorageData,
		);
	}
}
//#endregion

//#region YuGiOh Magazine
async function scrapeYuGiOhMagazinePage() {
	const { cardIds, pageContentStorageData, storageContentStorageData } =
		await getCommonVars();

	const boosterName = getBoosterName();
	const magazineCollection = (
		evaluateElement(document, xpathConditionalBoosters) as HTMLElement
	)?.children;

	for (let j = 1; j < 4; j += 2) {
		const pElement = magazineCollection.item(j);
		const ulElement = magazineCollection.item(j + 1);
		const cardsCollection = ulElement.children;

		console.log(pElement.tagName, ulElement.tagName);
		if (pElement.tagName === 'P' && ulElement.tagName === 'UL') {
			const cardRarity = (pElement as HTMLElement).innerText.trim();
			for (let k = 0; k < cardsCollection.length; k++) {
				const currentCard = cardsCollection.item(k) as HTMLElement;
				let cardName = currentCard.innerText.trim();
				let cardURL = (currentCard.firstElementChild as HTMLAnchorElement)
					?.href;
				if (cardURL.includes('#')) {
					cardURL = cardURL.replace(/#/g, '_');
				}

				const cardHasAlternateArtwork = cardName.includes('(Alternate artwork');
				if (cardHasAlternateArtwork || cardName.includes('(Primary')) {
					cardName = cardName.substring(0, cardName.indexOf(' (')).trim();
				}

				await pushCardInfo(
					cardName,
					boosterName,
					cardRarity,
					cardURL,
					pageContentStorageData,
					cardIds,
					cardHasAlternateArtwork,
				);
			}
		}
	}

	await updateContentLocalStorageData(
		boosterName,
		cardIds,
		pageContentStorageData,
		storageContentStorageData,
	);
	//console.log('test');
}
//#endregion
