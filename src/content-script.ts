// TODO: add button to this list to grab ALL cards in one loop? Maybe get images this way...
// https://yugioh.fandom.com/wiki/Gallery_of_Yu-Gi-Oh!_The_Eternal_Duelist_Soul_cards

enum BoosterPack {
  DarkMagician = "Dark Magician",
  MysticalElf = "Mystical Elf",
  RedEyesBDragon = "Red-Eyes B. Dragon",
  JudgeMan = "Judge Man",
  BlueEyesWhiteDragon = "Blue-Eyes White Dragon",
  Exodia = "Exodia",
  CyberHarpie = "Cyber Harpie",
  TigerAxe = "Tiger Axe",
  GateGuardian = "Gate Guardian",
  GeminiElf = "Gemini Elf",
  LauncherSpider = "Launcher Spider",
  GreatMoth = "Great Moth",
  Garoozis = "Garoozis",
  Relinquished = "Relinquished",
  BattleOx = "Battle Ox",
  BlueEyesToonDragon = "Blue-Eyes Toon Dragon",
  BlackLusterSoldier = "Black Luster Soldier",
  BlueEyesUltimateDragon = "Blue-Eyes Ultimate Dragon",
  BlueMilleniumPuzzle = "Blue Millenium Puzzle",
  MilleniumEye = "Millenium Eye",
  BusterBlader = "Buster Blader",
  GreenMilleniumPuzzle = "Green Millenium Puzzle",
  MultiColoredMilleniumPuzzle = "Multi-Colored Millenium Puzzle",
};

enum Rarity {
  Rare = "Rare",
  Common = "Common",
}

window.onload = () => {
  const button = document.createElement('button');
  button.id = 'scrapePage';
  button.textContent = 'Scrape Page';

  document.querySelector("#firstHeading").parentElement.append(button);

  button.addEventListener('click', () => {
    //scrapePage();
    scrapeBoosterPage();
    button.textContent = "Page Scraped!";
    button.disabled = true;
  });
};

function scrapeBoosterPage() {
  // booster pack name
  const boosterNameElement = document.querySelector('#firstHeading') as HTMLElement;
  const boosterName = boosterNameElement.innerText.replace('(EDS-BP)', '').trim();

  // booster unlock condition
  const xpathUnlockCondition = '//th[contains(text(), "Introduction")]/../following-sibling::tr/td/p';
  const unlockCondition = (evaluateElement(xpathUnlockCondition) as HTMLElement)?.innerText;
  //const boosterUnlockConditionElement = document.querySelector() as HTMLElement;
  const img = document.querySelector('div > figure > a.image') as HTMLAnchorElement;
  const imgLink = img.href
  console.log(
    boosterName, '\n',
    unlockCondition, '\n',
    imgLink, '\n',
  )
}

// TODO: Thinking I'll hit this from the booster pack page, passing in the pack info to make a card
// The cardID might be "boosterNameCardName" or something
function scrapePage(boosterPack: BoosterPack, rarity: Rarity) {
  //get Card Name from header of DOM
  const cardNameElement = (document.querySelector('#firstHeading') as HTMLElement);
  const cardName = cardNameElement ? cardNameElement.innerText : -1;
  //(cardName as string).replace('(EDS-BP)', '').trim();

  //get Card Description from DOM
  const xpathDescription = '//b[contains(text(),"Card descriptions")]/..//*/tbody/tr[1]/th/div/i/a[contains(text(),"The Eternal Duelist Soul")]';
  const descriptionNode = (evaluateElement(xpathDescription) as Element)?.closest('tbody');
  const cardDescriptionElement = (descriptionNode?.querySelector('tr:nth-child(3) > td') as HTMLElement);
  const cardDescription = cardDescriptionElement ? cardDescriptionElement.innerText : -1;

  // get card type node on DOM
  var xpathCardType = '//a[contains(text(),"Card type")]/../following-sibling::td/a';
  const cardTypeElement = (evaluateElement(xpathCardType) as HTMLElement);
  let cardType = cardTypeElement ? cardTypeElement.innerText : -1;


  // console log everything
  console.log(
    cardName, '\n',
    cardDescription, '\n',
    // cardboosterPacks, '\n', 
    cardType);
};

function evaluateElement(xpath: string) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function downloadImage(url: RequestInfo | URL, name: string) {
  fetch(url)
    .then(resp => resp.blob())
    .then(blob => {
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
    .catch(() => alert('An error sorry'));
}
