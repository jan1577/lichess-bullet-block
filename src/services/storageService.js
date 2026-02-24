// Abstraction for storage to handle Chrome (chrome.storage) and Firefox (browser.storage)

const StorageService = {
  /**
   * Retrieves items from local storage.
   * @param {string|string[]|Object} keys - A single key to get, list of keys to get, or a dictionary specifying default values.
   * @returns {Promise<Object>} A promise that resolves with the storage items.
   */
  get: (keys) => {
    return new Promise((resolve, reject) => {
      // Check if 'browser' is defined (Firefox standard)
      if (typeof browser !== 'undefined' && browser.storage) {
        browser.storage.local.get(keys)
          .then(resolve)
          .catch(reject);
      } 
      // Fallback to 'chrome' (Chrome standard)
      else if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      } else {
        reject(new Error('Storage API not available.'));
      }
    });
  },

  /**
   * Saves items to local storage.
   * @param {Object} items - An object which gives each key/value pair to update.
   * @returns {Promise<void>} A promise that resolves when the items are saved.
   */
  set: (items) => {
    return new Promise((resolve, reject) => {
      if (typeof browser !== 'undefined' && browser.storage) {
        browser.storage.local.set(items)
          .then(resolve)
          .catch(reject);
      } 
      else if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      } else {
        reject(new Error('Storage API not available.'));
      }
    });
  }
};

// Export for module systems or attach to global window
if (typeof window !== 'undefined') {
  window.StorageService = StorageService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageService;
}
