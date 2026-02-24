function saveOptions() {
  let blockBlitz = false;
  if (document.getElementById('block-blitz').checked) {
    blockBlitz = true;
  }

  // save puzzle variants: get which boxes have been checked by the user
  let blockRacer = false;
  let blockStreak = false;
  let blockStorm = false;
  
  if (document.getElementById('block-racer').checked) {
    blockRacer = true;
  }
  if (document.getElementById('block-streak').checked) {
    blockStreak = true;
  }
  if (document.getElementById('block-storm').checked) {
    blockStorm = true;
  }

  let enableQuotes = false;
  if (document.getElementById('enable-quotes').checked) {
    enableQuotes = true;
  }

  StorageService.set({
    block_blitz_storage: blockBlitz,
    block_puzzle_storm: blockStorm,
    block_puzzle_racer: blockRacer,
    block_puzzle_streak: blockStreak,
    enable_quotes: enableQuotes
  }).then(function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved. Refresh lichess to apply the changes.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}


/* Restore selected options from local storage */
function restoreOptions() {

  StorageService.get(['block_blitz_storage']).then(function (item) {
    if (item['block_blitz_storage']) {
      document.getElementById('block-blitz').checked = true;
      document.getElementById('enable-blitz').checked = false;
    }
    else {
      document.getElementById('block-blitz').checked = false;
      document.getElementById('enable-blitz').checked = true;
    }
  });

  for (let i = 0; i < 5; i += 2) {
    restorePuzzles(puzzleArray[i], puzzleArray[i + 1])
  }

  StorageService.get(['enable_quotes']).then(function (item) {
    if (item['enable_quotes']) {
      document.getElementById('enable-quotes').checked = true;
      document.getElementById('disable-quotes').checked = false;
    } else {
      document.getElementById('enable-quotes').checked = false;
      document.getElementById('disable-quotes').checked = true;
    }
  });
}


function restorePuzzles(storageVar, elementId) {
  StorageService.get([storageVar]).then(function (item) {
    if (item[storageVar]) {
      document.getElementById(elementId).checked = true;
    } else {
      document.getElementById(elementId).checked = false;
    }
  });
}


// used to restore selected options from local storage: first is the name of the variable
// in chrome local storage, second the html id of the checkbox
const puzzleArray = ['block_puzzle_streak', 'block-streak', 'block_puzzle_storm', 'block-storm', 'block_puzzle_racer', 'block-racer']

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('save').addEventListener('click',
  saveOptions);
