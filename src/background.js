/* global chrome */

function changeSettings (tab) {
	chrome.tabs.sendMessage(tab.id, { action: `go` }, function () {
		if (chrome.runtime.lastError) {
			chrome.tabs.executeScript(tab.id, {file: `content_script.js`});
		}
	});
}

chrome.browserAction.onClicked.addListener(changeSettings);
