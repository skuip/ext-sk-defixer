function changeSettings (tab) {
	chrome.tabs.sendMessage(tab.id, { action: `go` }, function (response) {
		if (response === `OK`) return console.log(tab.id, `Message received`);
		// Message fails first time, since script isn`t yet injected.
		if (chrome.runtime.lastError) {
			console.log(tab.id, `Injecting content_script.js`);
			chrome.tabs.executeScript(tab.id, {file: `content_script.js`}, function (response) {
				if (response[0] !== `OK`) {
					return console.warn(tab.id, `Unexpected script response`, response);
				}
				chrome.tabs.sendMessage(tab.id, { action: `go` }, function (response) {
					if (response === `OK`) return console.log(tab.id, `Message received`);
					console.warn(tab.id, `Unexpected message response`);
				});
			});
		}
	});
}

chrome.browserAction.onClicked.addListener(changeSettings);
