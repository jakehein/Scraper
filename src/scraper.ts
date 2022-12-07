import { BoosterPack, IContentStorageData } from './content-script';

const boostersRemaining = document.getElementById('boostersRemaining');
const downloadContents = document.getElementById('contents');
let scrapedContent: IContentStorageData;

window.onload = async () => {
	scrapedContent = (
		(await chrome.storage.local.get('ygoKey')) as {
			ygoKey: IContentStorageData;
		}
	)?.ygoKey;
	console.log(scrapedContent);
	const boostersUnscraped: string[] = Object.values(BoosterPack);
	scrapedContent.boosterPacks.forEach((pack) => {
		const i = boostersUnscraped.indexOf(pack.name);
		boostersUnscraped.splice(i, 1);
	});
	boostersUnscraped.forEach((el) => {
		const element = document.createElement('div');
		element.innerHTML = `<span>${el}</span>`;
		boostersRemaining.append(element);
	});
	if (boostersRemaining.children.length === 1) {
		(downloadContents as HTMLInputElement).disabled = false;
	}
};

downloadContents.addEventListener('click', async () => {
	downloadJSON();
});

function downloadJSON() {
	var dataStr =
		'data:text/json;charset=utf-8,' +
		encodeURIComponent(JSON.stringify(scrapedContent));
	var dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute('href', dataStr);
	dlAnchorElem.setAttribute('download', 'contentDataYGOEDS.json');
	dlAnchorElem.click();
}
