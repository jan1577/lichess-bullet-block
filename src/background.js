// Open the "What's New?" page only for minor/major updates
const api = typeof browser !== 'undefined' ? browser : chrome;

api.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'update') {
        const prev = (details.previousVersion || '').split('.');
        const curr = api.runtime.getManifest().version.split('.');

        // Compare major and minor only, open tab if either changed
        const isMinorOrMajor = prev[0] !== curr[0] || prev[1] !== curr[1];
        if (isMinorOrMajor) {
            api.tabs.create({ url: api.runtime.getURL('whatsnew.html') });
        }
    }
});
