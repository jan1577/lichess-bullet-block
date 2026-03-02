/* Remove the href attribute, and styles for elements that should be blocked, but not removed from the screen 
 * @param element: html element where attributes are removed
 */
function removeHref(element) {
    element.removeAttribute('href');
    // change styling to plain text
    element.style.color = "inherit";
    element.style.pointerEvents = "none";
}


/* Remove Puzzle Storm, Streak and Racer if selected */
let links = document.getElementsByTagName('a'),
    holdarray = [];

/* check all href for links to puzzle variants */
Array.from(links, elem => {
    if (elem.getAttribute('href') == "/storm") {
        // get current option
        StorageService.get(['block_puzzle_storm']).then(function (result) {
            // check if puzzle is blocked
            // if it's a "button" -> remove it
            if (result['block_puzzle_storm']) {
                if (elem.parentElement.role == "group" || elem.className == "storm-play-again button") {
                    elem.style.display = 'none';
                } else {
                    removeHref(elem);
                }
            }
        }).catch((e) => console.error(e));
    }
    else if (elem.getAttribute('href') == "/racer") {
        StorageService.get(['block_puzzle_racer']).then(function (result) {
            // check puzzle racer is blocked
            if (result['block_puzzle_racer']) {
                if (elem.parentElement.role == "group") {
                    elem.style.display = 'none';
                } else {
                    removeHref(elem);
                    // remove small icon next to span on left menu bar
                    if (elem.children[1]) {
                        elem.children[1].remove();
                    }
                }
            }
        }).catch((e) => console.error(e));
    }
    else if (elem.getAttribute('href') == "/streak") {
        StorageService.get(['block_puzzle_streak']).then(function (result) {
            if (result['block_puzzle_streak']) {
                if (elem.parentElement.role == "group") {
                    elem.style.display = 'none';
                } else {
                    removeHref(elem);
                    // remove small icon next to span on left menu bar
                    if (elem.children[1]) {
                        elem.children[1].remove();
                    }
                }
            }
        }).catch((e) => console.error(e));
    }
});