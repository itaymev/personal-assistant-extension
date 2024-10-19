function getPageDetails() {
    return {
        url: window.location.href,
        title: document.title || '',
        author: document.querySelector('meta[name="author"]')?.getAttribute('content') ?? '',
        publicationDate: document.querySelector('meta[name="date"]')?.getAttribute('content') ?? '',
        websiteName: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ?? window.location.hostname
    };
}