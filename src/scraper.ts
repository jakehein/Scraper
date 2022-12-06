import { BoosterPack, IContentStorageData } from './content-script';

const boostersRemaining = document.getElementById('boostersRemaining');
const downloadedContents = document.getElementById('contents');
let scrapedContent: IContentStorageData;

window.onload = async () => {
	console.log('test');
	scrapedContent = (
		(await chrome.storage.local.get('ygoKey')) as {
			ygoKey: IContentStorageData;
		}
	)?.ygoKey;
	console.log(scrapedContent);
	const str: string[] = Object.values(BoosterPack);
	scrapedContent.boosterPacks.forEach((pack) => {
		const i = str.indexOf(pack.name);
		str.splice(i, 1);
	});
	str.forEach((el) => {
		const element = document.createElement('div');
		element.innerHTML = `<span>${el}</span>`;
		boostersRemaining.append(el);
	});
};

downloadedContents.addEventListener('click', async () => {
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
