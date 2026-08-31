// Listen for the extension icon click
chrome.action.onClicked.addListener(async (tab) => {
    console.log(tab.id, "Defixer browser action button pressed");
    try {
        let response = await chrome.tabs.sendMessage(tab.id, { action: `go` });
        if (response === `OK`) {
            return console.log(tab.id, `Message received`);
        }
    } catch (e) {
        try {
            console.log(tab.id, `Injecting content_script.js`);
            response = await browser.scripting.executeScript({
                target: { tabId: tab.id, allFrames: true },
                files: ["content_script.js"],
            });

            if (response?.[0]?.result !== "OK") {
                return console.log(tab.id, 'result !== "OK"');
            }

            try {
                response = await chrome.tabs.sendMessage(tab.id, { action: `go` });
                if (response === `OK`) {
                    return console.log(tab.id, `Message received`);
                }

                console.warn(tab.id, `Unexpected message response`);
            } catch (e) {
                console.warn(tab.id, e);
            }
        } catch (e) {
            console.warn(tab.id, e);
        }
    }
});
