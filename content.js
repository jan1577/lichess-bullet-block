// first time use: set value to false
chrome.storage.local.get(['block_blitz_storage'], function(result) {
    if (result == null) {
        console.log("undefined, setting storage")
        chrome.storage.local.set({'block_blitz_storage': false});
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

/*
* This function removes the two divs for Bullet Games in the Quick Pairing Menu.
*/
function remove_elements_QP(){
    // remove bullet
    let _bullet1 = document.querySelector('[data-id="1+0"]');
    let _bullet2 = document.querySelector('[data-id="2+1"]');
    _bullet1.remove();
    _bullet2.remove();

    // get value for blitz from storage; if true, remove blitz values

    chrome.storage.local.get(['block_blitz_storage'], function(result) {
        
        if (result['block_blitz_storage']){
            let _blitz1 = document.querySelector('[data-id="3+0"]');
            let _blitz2 = document.querySelector('[data-id="3+2"]');
            let _blitz3 = document.querySelector('[data-id="5+0"]');
            let _blitz4 = document.querySelector('[data-id="5+3"]');
            _blitz1.remove();
            _blitz2.remove();
            _blitz3.remove();
            _blitz4.remove();
        };
    });
}

/*
* This function waits for updates in the Lobby. Whenever new games are added,
* {remove_bullet_lobby} is called to filter and remove the Bullet Games.
*/
function lobby_open(){

    // add Mutation observer to <table class"hools__list"> to check if lobby is updated
    games_table = document.querySelector(
        "#main-wrap > main > div.lobby__app.lobby__app-real_time > div.lobby__app__content.lreal_time > table"
    );

    const mutationObserver_lobby = new MutationObserver(mutations => {
        // lobby is refreshed -> remove Nullet Games once again
        remove_elements_lobby();
    });
    
    mutationObserver_lobby.observe(games_table, {childList: true, subtree: true})
    
}


function remove_elements_lobby(){

    games_table = document.querySelector(
        "#main-wrap > main > div.lobby__app.lobby__app-real_time > div.lobby__app__content.lreal_time > table"
    );
    
    var tbody = games_table.getElementsByTagName('tbody')[0];
    var tableRow = tbody.getElementsByTagName('tr');
    
    chrome.storage.local.get(['block_blitz_storage'], function(result) {
        if (result['block_blitz_storage']){
            remove_elements_lobby(true)
            // loop through all games. if Bullet -> set display to none 
            for (var t = 0; t < tableRow.length; t++){
                var game_title = tableRow[t].title;
                // use substring bullet to remove both bullet, ultrabullet and blitz
                if (game_title.includes("Bullet") || game_title.includes("Blitz")){
                    tableRow[t].style.display = "none";
                }
            }
        }
        else{
            for (var t = 0; t < tableRow.length; t++){
                var game_title = tableRow[t].title;
                // use substring bullet to remove both bullet and ultrabullet
                if (game_title.includes("Bullet")){
                    tableRow[t].style.display = "none";
                }
            }
        }
    });
}


// Check if Quick Pairing is open when the page is loaded or refreshed.
if (document.querySelector('[data-id="1+0"]')){
    remove_elements_QP();
}
// Check if the Lobby is open when the page is loaded or refreshed.
else if (document.querySelector("#main-wrap > main > div.lobby__app.lobby__app-real_time > div.lobby__app__content.lreal_time > table > thead > tr > th:nth-child(2)")){
    lobby_open();
}


/*
* The slider is opened when the Create New Game button is clicked.
* 7 equals three minutes, so the minimum value is set to 7.
*/

if (document.querySelector("#modal-wrap > div > div.setup-content > div.time-mode-config.optional-config > div.time-choice.range > input")){
    let slider = document.querySelector(
        "#modal-wrap > div > div.setup-content > div.time-mode-config.optional-config > div.time-choice.range > input"
    );

    slider.min = 7;

    chrome.storage.local.get(['block_blitz_storage'], function(result) {
        if (result['block_blitz_storage']){
            slider.min = 14;
        }
    });
}


/*
* The following section is used to remove the "New Opponent" Button if the current game is 
* a Bullet Game. Otherwise, the buttom remains displayed.
*/
if (document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div")){
    let new_opponent = document.querySelector(
        "#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > a"
    );
    
    // href for new game
    let link = new_opponent.href.toString();

    chrome.storage.local.get(['block_blitz_storage'], function(result) {
        // check if blitz games are blocked
        if (result['block_blitz_storage']){

            let substrings = ["1+0", "2+1", "3+0", "3+2", "5+0", "5+3"]
            if (substrings.some(str => link.includes(str))){
                // if the current game is a Bullet or Blitz Game, do not display the New Opponent button
                document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > a:nth-child(2)").style.display = "none";
            }
            else {
                // if not a Bullet Game, display the New Opponent button
                document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > a:nth-child(2)").style.display = "block";
            }
        // else: only block bullet games
        } else {
            let substrings = ["1+0", "2+1"]
            if (substrings.some(str => link.includes(str))){
                // if the current game is a Bullet Game, do not display the New Opponent button
                document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > a:nth-child(2)").style.display = "none";
            }
            else {
                // if not a Bullet Game, display the New Opponent button
                document.querySelector("#main-wrap > main > div.round__app.variant-standard > div.rcontrols > div > a:nth-child(2)").style.display = "block";
            }
        }
    })
}
