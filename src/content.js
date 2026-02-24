// first time use: set all values to false (only bullet blocked)
StorageService.get(['block_blitz_storage']).then(function(result) {
    if (Object.keys(result).length === 0) {
        StorageService.set({'block_blitz_storage': false});
        StorageService.set({'block_puzzle_storm': false});
        StorageService.set({'block_puzzle_streak': false});
        StorageService.set({'block_puzzle_racer': false});
    }
  });


// parent element with 4 different tabs: Quick Pairing, Lobby, Correspondence, Games in play
const parent_lobby = document.querySelector("#main-wrap > main");

// the mutation observer detects when another tab in parent_lobby is clicked.
const mutationObserver = new MutationObserver(mutations => {
    // lobby is opened
    if (mutations[0].addedNodes[0].className == "lobby__app lobby__app-real_time"){
        lobby_open();
    }

    // quick pairing is opened
    else if (mutations[0].addedNodes[0].className == "lobby__app lobby__app-pools"){
        remove_elements_QP();
    }
});
// adding the observer to the parent_lobby
mutationObserver.observe(parent_lobby, {childList: true});


// div that contains the second "create a game" button
if (document.querySelector("#main-wrap > main > div.lobby__table")){
  const lobby_start = document.querySelector("#main-wrap > main > div.lobby__table");

  // observing changes, as the button changes it's class name when clicked
  const mutationObserver_lobby_start = new MutationObserver(mutations => {
      // if statement to check whether the button was clicked or the div closed
      if (document.querySelector("#main-wrap > main > div.lobby__table > div.lobby__start > a.button.button-metal.config_hook.active")){
          change_slider();
      }

  });

  mutationObserver_lobby_start.observe(lobby_start, {childList: true});

}


/**
 * This function removes the two divs for Bullet Games in the Quick Pairing Menu
 * and, if set in the options, the four divs for Blitz Games.
 */
function remove_elements_QP(){
    // remove bullet
    let _bullet1 = document.querySelector('[data-id="1+0"]');
    if (_bullet1) _bullet1.remove();

    let _bullet2 = document.querySelector('[data-id="2+1"]');
    if (_bullet2) _bullet2.remove();

    // get value for blitz from storage; if true, remove blitz values

    StorageService.get(['block_blitz_storage']).then(function(result) {
        if (result['block_blitz_storage']){
            let _blitz1 = document.querySelector('[data-id="3+0"]');
            if (_blitz1) _blitz1.remove();
            let _blitz2 = document.querySelector('[data-id="3+2"]');
            if (_blitz2) _blitz2.remove();
            let _blitz3 = document.querySelector('[data-id="5+0"]');
            if (_blitz3) _blitz3.remove();
            let _blitz4 = document.querySelector('[data-id="5+3"]');
            if (_blitz4) _blitz4.remove();
        };
    });
}


/**
 * This function waits for updates in the Lobby. Whenever new games are added,
 * {remove_bullet_lobby} is called to filter and remove the Bullet Games.
 */
function lobby_open(){

    // add Mutation observer to <table class"hools__list"> to check if lobby is updated
    let games_table = document.querySelector(
        "#main-wrap > main > div.lobby__app.lobby__app-real_time > div.lobby__app__content.lreal_time > table"
    );

    const mutationObserver_lobby = new MutationObserver(mutations => {
        // lobby is refreshed -> remove Bullet Games once again
        remove_elements_lobby(games_table);
    });

    mutationObserver_lobby.observe(games_table, {childList: true, subtree: true})

}


// Check if Quick Pairing is open when the page is loaded or refreshed.
if (document.querySelector('[data-id="1+0"]')){
    remove_elements_QP();
}
// Check if the Lobby is open when the page is loaded or refreshed.
else if (document.querySelector("#main-wrap > main > div.lobby__app.lobby__app-real_time > div.lobby__app__content.lreal_time > table > thead > tr > th:nth-child(2)")){
    lobby_open();
}


/**
 * This function removes elements from the lobby. It hides Bullet Games and, if
 * set in the options, also Blitz Games by reading the games' titles
 */
function remove_elements_lobby(games_table){

    let tbody = games_table.getElementsByTagName('tbody')[0];
    let tableRows = tbody.getElementsByTagName('tr');

    // check for current option
    StorageService.get(['block_blitz_storage']).then(function(result) {
        let block_blitz_games = result['block_blitz_storage'];
        
        // loop through all games. if Bullet -> set display to none
        for (let row of tableRows){
            let game_title = row.title;
            // use substring bullet to remove both bullet, ultrabullet and blitz
            if (game_title.includes("Bullet") || (block_blitz_games && game_title.includes("Blitz"))){
                row.style.display = "none";
            }
        }
    });
}


/**
 * The slider is opened when the Create New Game button is clicked.
 * {Change slider} changes the min value based on options set.
 */

if (document.querySelector("#modal-wrap > div > div.setup-content > div.time-mode-config.optional-config > div.time-choice.range > input")){
    change_slider();
}


// changing minimum value of the slider
function change_slider(){

    let slider = document.querySelector(
        //"#modal-wrap > div > div.setup-content > div.time-mode-config.optional-config > div.time-choice.range > input"
        "#main-wrap > main > div.lobby__table > dialog > div.scrollable > div > div.setup-content > div.time-mode-config.optional-config > div.time-choice.range > input"
    );
    // minimum blitz value
    slider.min = 7;

    StorageService.get(['block_blitz_storage']).then(function(result) {
        if (result['block_blitz_storage']){
            // minimum rapid value
            slider.min = 12;
        }
    });
}


/*
 * The following section is used to remove the "New Opponent" Button if the current game is
 * a Bullet Game. Otherwise, the buttom remains displayed.
 */
if (document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div")){
    let new_opponent = document.querySelector(
        "#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > button.fbt.new-opponent"
    );

    // href for new game
    if (new_opponent) {
        // check the game title/meta info for the time control
        let link = document.title + " " + (document.querySelector('.game__meta')?.innerText || "");
        StorageService.get(['block_blitz_storage']).then(function(result) {

            let substrings = [];
    
            if (result['block_blitz_storage']){
                substrings = ["1+0", "2+1", "3+0", "3+2", "5+0", "5+3"];
            } else {
                substrings = ["1+0", "2+1"]
            }
            compare_strings(substrings, link);
        })
    }
}


/**
 * This function compares the link of the "new opponent" button with the substrings
 * of game types that are blocked. If they match, the button is hidden.
 * @param  substrings - an array of substrings, contains bullet or bullet and blitz
 * @param  link - the link of the button
 */
function compare_strings(substrings, link){
    if (substrings.some(str => link.includes(str))){
        // if the current game is a Bullet or Blitz Game, do not display the New Opponent button
        document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > button.fbt.new-opponent").style.display = "none";
    }
    else {
        // if not a Bullet or Blitz Game, display the New Opponent button
        document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > button.fbt.new-opponent").style.display = "block";
    }
}
