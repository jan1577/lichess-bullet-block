// Open the "What's New?" page when the extension is updated
const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'update') {
        api.tabs.create({ url: api.runtime.getURL('whatsnew.html') });
    }
});
