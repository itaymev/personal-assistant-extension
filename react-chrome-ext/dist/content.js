function getPublicationDate() {
    // Check common meta tags
    const metaPublishedTime = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content');
    const metaDate = document.querySelector('meta[name="date"]')?.getAttribute('content');
    const metaPubDate = document.querySelector('meta[name="pubdate"]')?.getAttribute('content');
    const schemaDatePublished = document.querySelector('meta[itemprop="datePublished"]')?.getAttribute('content');

    // Check the <time> element
    const timeElement = document.querySelector('time[datetime]')?.getAttribute('datetime');

    // Check for common class names
    const dateElement = document.querySelector('.date')?.innerText ||
        document.querySelector('.published')?.innerText ||
        document.querySelector('.post-date')?.innerText;

    // Return the first found result
    return metaPublishedTime || metaDate || metaPubDate || schemaDatePublished || timeElement || dateElement || '';
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageDetails") {
        const pageDetails = {
            url: window.location.href,
            title: document.title || '',
            author: document.querySelector('meta[name="author"]')?.getAttribute('content') || '',
            publicationDate: getPublicationDate(),
            websiteName: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || window.location.hostname
        };
        sendResponse({ pageDetails });
    }
});