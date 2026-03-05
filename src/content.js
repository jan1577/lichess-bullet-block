// First time setup - ensure defaults
StorageService.get(['block_blitz_storage']).then(function(result) {
    if (Object.keys(result).length === 0) {
        StorageService.set({'block_blitz_storage': false});
        StorageService.set({'block_puzzle_storm': false});
        StorageService.set({'block_puzzle_streak': false});
        StorageService.set({'block_puzzle_racer': false});
    }
}).catch((error) => console.error(error));

// --- Observers ---

const parent_lobby = document.querySelector("#main-wrap > main");

// Observe tab switching (Lobby vs Quick Pairing vs Correspondence)
// Lichess uses snabbdom which replaces the lobby__app div entirely on tab switch.
// The class includes extra lck-* classes, so we must use classList.contains().
const mutationObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1 || !node.classList) continue;
            if (node.classList.contains('lobby__app-real_time')) {
                lobby_open();
                return;
            }
            if (node.classList.contains('lobby__app-pools')) {
                remove_elements_QP();
                return;
            }
        }
    }
});
if (parent_lobby) {
    mutationObserver.observe(parent_lobby, {childList: true});
}

// Observe "Create a Game" modal opening
if (document.querySelector("#main-wrap > main > div.lobby__table")){
  const lobby_start = document.querySelector("#main-wrap > main > div.lobby__table");

  const mutationObserver_lobby_start = new MutationObserver(mutations => {
      // Check if modal opened (mask or active button)
      if (document.querySelector("#main-wrap > main > div.lobby__table > div.snab-modal-mask")) {
        change_slider();
      }
      else if (document.querySelector("#main-wrap > main > div.lobby__table > div.lobby__start > a.button.button-metal.config_hook.active")){
          change_slider();
      }
  });

  mutationObserver_lobby_start.observe(lobby_start, {childList: true});
}

// --- Main Controllers ---

/**
 * Removes Bullet/Blitz options from Quick Pairing menu.
 */
function remove_elements_QP(){
    StorageService.get(['blitz_mode', 'block_blitz_storage', 'blitz_custom_rule']).then(function(result) {
        // Get pool buttons inside Quick Pairing (div.lpool with data-id)
        const poolContainer = document.querySelector('.lobby__app__content.lpools');
        if (!poolContainer) return;
        const buttons = poolContainer.querySelectorAll('[data-id]');
        buttons.forEach(btn => {
            LobbyUtils.processQuickPairingButton(btn, result);
        });
    }).catch((error) => console.error(error));
}

/**
 * Sets up mutation observer for the real-time lobby table.
 */
function lobby_open(){
    let games_table = document.querySelector(
        ".lobby__app__content.lreal_time table"
    );
    if (!games_table) return;

    const mutationObserver_lobby = new MutationObserver(mutations => {
        remove_elements_lobby(games_table);
    });

    mutationObserver_lobby.observe(games_table, {childList: true, subtree: true});
    
    // Run once immediately
    remove_elements_lobby(games_table);
}

/**
 * Filters rows in the lobby table.
 */
function remove_elements_lobby(games_table){
    let tbody = games_table.getElementsByTagName('tbody')[0];
    if (!tbody) return;
    
    let tableRows = tbody.getElementsByTagName('tr');

    StorageService.get(['blitz_mode', 'block_blitz_storage', 'blitz_custom_rule']).then(function(result) {
        for (let row of tableRows){
            LobbyUtils.processRow(row, result);
        }
    }).catch((error) => console.error(error));
}

/**
 * Adjusts sliders in "Create a Game" modal.
 */
function change_slider(){
    // Find sliders
    let sliders = document.querySelectorAll(".lobby__table .setup-content input.range");
    if (sliders.length === 0) {
        sliders = document.querySelectorAll(".setup-content input.range");
    }

    if (sliders.length === 0) return;

    let timeSlider = sliders[0];
    let incSlider = sliders[1]; // might be undefined

    StorageService.get(['blitz_mode', 'block_blitz_storage', 'blitz_custom_rule']).then(function(result) {
        SliderUtils.applyConstraints(timeSlider, incSlider, result);
        
        // Also clean up preset buttons inside the modal
        remove_preset_buttons();
    }).catch((error) => console.error(error));
}

/**
 * Removes preset buttons (1+0, 3+0 etc) inside the Create Game modal.
 */
function remove_preset_buttons() {
    const presets = document.querySelectorAll(".setup-content .presets button");
    if (!presets.length) return;

    StorageService.get(['blitz_mode', 'block_blitz_storage', 'blitz_custom_rule']).then(function(result) {
         presets.forEach(btn => {
             LobbyUtils.processQuickPairingButton(btn, result);
         });
    }).catch((error) => console.error(error));
}

// --- Initial Checks ---

// Check if Quick Pairing is open (look for pool buttons or the pools content area)
if (document.querySelector('.lobby__app__content.lpools [data-id]') || document.querySelector('[data-id="1+0"]')){
    remove_elements_QP();
}
// Check if Lobby is open
else if (document.querySelector('.lobby__app__content.lreal_time table') || document.querySelector('.lobby__app-real_time')){
    lobby_open();
}
// Check if "Create Game" modal is open (e.g. direct link)
if (document.querySelector(".setup-content input.range")){
    change_slider();
}

// "New Opponent" Button Logic
if (document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div")){
    let new_opponent = document.querySelector(
        "#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > button.fbt.new-opponent"
    );

    if (new_opponent) {
        let link = document.title + " " + (document.querySelector('.game__meta')?.innerText || "");
        StorageService.get(['block_blitz_storage']).then(function(result) {
             // We can check if the current game was Bullet or allowed Blitz
             // Title: "Rated Blitz game 3+0"
             const tcStr = TimeControlUtils.extractTimeControl(link);
             if (tcStr) {
                 const tc = TimeControlUtils.parseTimeControl(tcStr);
                 
                 // If it behaves like bullet, hide "New Opponent"
                 if (tc && TimeControlUtils.isBullet(tc.minutes, tc.increment)) {
                     new_opponent.style.display = "none";
                 } 
                 // If it is Blitz and Blitz is blocked/restricted, hide it
                 else if (tc && TimeControlUtils.isBlitz(tc.minutes, tc.increment)) {
                     if (!TimeControlUtils.isGameAllowed(tcStr, result)) {
                         new_opponent.style.display = "none";
                     }
                 }
             }
        }).catch((error) => console.error(error));
    }
}