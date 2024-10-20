chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "getPageDetails" }, (response) => {
        if (response) {
            console.log("Page Details:", response.pageDetails);
        } else {
            console.error("No response from content script.");
        }
    });
});