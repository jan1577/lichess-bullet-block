# LichessBulletBlock

<table>
  <tr>
    <a href="https://chrome.google.com/webstore/detail/lichessbulletblock/hggjliiolhipmgoomadfmpdlafknhpmd" target="_blank">
      <img src="images/chrome.svg" alt="Chrome logo" width="30px">
    </a>
    <a href="https://chrome.google.com/webstore/detail/lichessbulletblock/hggjliiolhipmgoomadfmpdlafknhpmd" target="_blank">
      <img src="images/brave.svg" alt="Brave logo" width="30px">
    </a>
    <a href="https://chrome.google.com/webstore/detail/lichessbulletblock/hggjliiolhipmgoomadfmpdlafknhpmd" target="_blank">
      <img src="images/edge.svg" alt="Edge logo" width="30px">
    </a>
    <a href="https://chrome.google.com/webstore/detail/lichessbulletblock/hggjliiolhipmgoomadfmpdlafknhpmd" target="_blank">
      <img src="images/opera.svg" alt="Opera logo" width="30px">
    </a>   
    <a href="https://addons.mozilla.org/en-US/firefox/addon/lichessbulletblock/" target="_blank">
      <img src="images/firefox.svg" alt="Firefox logo" width="30px">
    </a>
  </tr>
</table>

A Chrome Extension & Firefox Addon to remove Bullet Games from lichess.org.

Bullet Games are addictive - this Browser Extension removes all options to launch a Bullet Game on lichess, stopping
you from wasting your time by chasing the next dopamine push.

In addition, you can disable Blitz Games and select Puzzle modes you want to block.

## Setup
You can get the extension in the Chrome Webstore or add it to your browser manually.

To download it from the webstore for any chromium based browser, click [here](https://chrome.google.com/webstore/detail/lichessbulletblock/hggjliiolhipmgoomadfmpdlafknhpmd).
To download for firefox, click [here](https://addons.mozilla.org/en-US/firefox/addon/lichessbulletblock/)

### Local Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Build the extension for your target platform:
   - For Chrome: `npm run build chrome`
   - For Firefox: `npm run build firefox`
4. The build script will prompt you to optionally bump the version (patch, minor, or major).
5. The built extension will be available in the `dist/chrome` or `dist/firefox` directory.
6. Load the extension in your browser:
   - **Chrome**: Go to `chrome://extensions`, enable "Developer mode", click "Load unpacked", and select the `dist/chrome` folder.
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on...", and select the zipped directory.

## Options
The extension has an options page which can be found by right-clicking on the extension logo and navigating to "Options".
Here, you can set your preferences for Blitz and Puzzles. You can also enable or disable quotes that are added to the main page.
After saving, refresh the page to apply the changes.
