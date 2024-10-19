// content.js

// reads content from a webpage and sends to the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scanPage") {
        const pageDetails = {
            url: window.location.href,
            title: document.title || '',
            author: document.querySelector('meta[name="author"]') ? document.querySelector('meta[name="author"]').getAttribute('content') : '',
            publicationDate: document.querySelector('meta[name="date"]') ? document.querySelector('meta[name="date"]').getAttribute('content') : '',
            websiteName: document.querySelector('meta[property="og:site_name"]') ? document.querySelector('meta[property="og:site_name"]').getAttribute('content') : window.location.hostname
        };
        sendResponse(pageDetails);
    }
});