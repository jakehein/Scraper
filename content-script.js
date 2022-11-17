// TODO: add button to this list to grab ALL cards in one loop? 
// https://yugioh.fandom.com/wiki/Gallery_of_Yu-Gi-Oh!_The_Eternal_Duelist_Soul_cards

const boosterPackIds = {
  DarkMagician: "Dark Magician",
  MysticalElf: "Mystical Elf",
  RedEyesBDragon: "Red-Eyes B. Dragon",
  JudgeMan: "Judge Man",
  BlueEyesWhiteDragon: "Blue-Eyes White Dragon",
  Exodia: "Exodia",
  CyberHarpie: "Cyber Harpie",
  TigerAxe: "Tiger Axe",
  GateGuardian: "Gate Guardian",
  GeminiElf: "Gemini Elf",
  LauncherSpider: "Launcher Spider",
  GreatMoth: "Great Moth",
  Garoozis: "Garoozis",
  Relinquished: "Relinquished",
  BattleOx: "Battle Ox",
  BlueEyesToonDragon: "Blue-Eyes Toon Dragon",
  BlackLusterSoldier: "Black Luster Soldier",
  BlueEyesUltimateDragon: "Blue-Eyes Ultimate Dragon",
  BlueMilleniumPuzzle: "Blue Millenium Puzzle",
  MilleniumEye: "Millenium Eye",
  BusterBlader: "Buster Blader",
  GreenMilleniumPuzzle: "Green Millenium Puzzle",
  MultiColoredMilleniumPuzzle: "Multi-Colored Millenium Puzzle",
};

window.onload = () => {
  const button = document.createElement('button');
  button.id = 'scrapePage';
  button.textContent = 'Scrape Page';

  document.querySelector("#firstHeading").append(button);

  button.addEventListener('click', () => {
    scrapePage();
    button.textContent = "Page Scraped!";
    button.disabled = true;
  });
};

function scrapePage() {
  //might need to change cardName
  const cardName = document.querySelector('#mw-content-text > div > table.cardtable > tbody > tr:nth-child(3) > td').innerText;

  //get Card Description node from DOM
  var xpathDescription = '//b[contains(text(),"Card descriptions")]/..//*/tbody/tr[1]/th/div/i/a[contains(text(),"The Eternal Duelist Soul")]';
  var descriptionMatchingElement = document.evaluate(xpathDescription, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var descriptionNode = descriptionMatchingElement.closest('tbody');

  const cardDescription = descriptionNode.querySelector('tr:nth-child(3) > td').innerText;

  //get Video Game Sets node on DOM
  var xpathVideoGameSets = '//b[contains(text(),"Video game sets")]/..//*/tbody/tr[1]/th/div/i/a[contains(text(),"The Eternal Duelist Soul")]';
  var videoGameSetsMatchingElement = document.evaluate(xpathVideoGameSets, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  var videoGameSetsNode = videoGameSetsMatchingElement.closest('tbody');

  const cardboosterPack = videoGameSetsNode.querySelector('tr:nth-child(3) > td').innerText;

  // var xpath = '//a[contains(text(),"The Eternal Duelist Soul")]';
  // var matchingElement = videoGameSetsNode.evaluate(xpath, videoGameSetsNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  
  // const cardDescription = document.querySelector('').innerText;
  // const cardDescription = document.querySelector('').innerText;
  // const cardDescription = document.querySelector('').innerText;
  // const cardDescription = document.querySelector('').innerText;
  // const cardDescription = document.querySelector('').innerText;
  console.log(cardName, '\n', cardDescription, '\n', cardboosterPack);
};

// chrome.runtime.onMessage.addListener((message) => {
//   if (message.message === 'test') {
//     console.log('content script');
//     chrome.runtime.sendMessage({
//       message: 'test message from content script',
//     });
//   }
// });
