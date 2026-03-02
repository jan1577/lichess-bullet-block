function saveOptions() {
  let blitzMode = 'no';
  if (document.getElementById('block-blitz').checked) {
    blitzMode = 'yes';
  } else if (document.getElementById('custom-blitz').checked) {
    blitzMode = 'custom';
  }

  const customRule = {
    minutes: document.getElementById('custom-minutes').value,
    increment: document.getElementById('custom-increment').value,
    operator: document.getElementById('custom-operator').value
  };

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
    blitz_mode: blitzMode,
    blitz_custom_rule: customRule,
    // Keep legacy for backward compatibility if needed, but 'blitz_mode' is primary now
    block_blitz_storage: blitzMode === 'yes', 
    block_puzzle_storm: blockStorm,
    block_puzzle_racer: blockRacer,
    block_puzzle_streak: blockStreak,
    enable_quotes: enableQuotes
  }).then(function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved. Refresh lichess to apply the changes.';
    
    // Update custom rules visibility immediately after save
    toggleCustomRules();

    setTimeout(function () {
      status.textContent = '';
    }, 750);
  }).catch((e) => {
    const status = document.getElementById('status');
    status.textContent = 'Error saving options: ' + e.message;
    console.error(e);
  });
}

function toggleCustomRules() {
  const customContainer = document.getElementById('custom-rules-container');
  if (document.getElementById('custom-blitz').checked) {
      customContainer.style.display = 'block';
  } else {
      customContainer.style.display = 'none';
  }
}

/* Restore selected options from local storage */
function restoreOptions() {

  StorageService.get(['blitz_mode', 'block_blitz_storage', 'blitz_custom_rule']).then(function (item) {
    let mode = item['blitz_mode'] || 'no';

    if (mode === 'yes') {
      document.getElementById('block-blitz').checked = true;
    } else if (mode === 'custom') {
      document.getElementById('custom-blitz').checked = true;
    } else {
      document.getElementById('enable-blitz').checked = true;
    }

    // Restore custom rules
    let customRule = item['blitz_custom_rule'] || {};
    document.getElementById('custom-minutes').value = customRule.minutes || 3;
    document.getElementById('custom-increment').value = customRule.increment || 0;
    document.getElementById('custom-operator').value = customRule.operator || 'AND';
    
    // Update display values
    document.getElementById('minutes-val').innerText = customRule.minutes || 3;
    document.getElementById('increment-val').innerText = customRule.increment || 0;

    toggleCustomRules();
  }).catch((e) => console.error(e));

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
  }).catch((e) => console.error(e));

  // Add event listeners for radio buttons to toggle visibility
  document.querySelectorAll('input[name="blitz-radio"]').forEach(radio => {
    radio.addEventListener('change', toggleCustomRules);
  });
  
  // Add slider listeners (already inline in HTML, but good to have)
  document.getElementById('custom-minutes').addEventListener('input', function() {
      document.getElementById('minutes-val').innerText = this.value;
  });
  document.getElementById('custom-increment').addEventListener('input', function() {
      document.getElementById('increment-val').innerText = this.value;
  });
}



function restorePuzzles(storageVar, elementId) {
  StorageService.get([storageVar]).then(function (item) {
    if (item[storageVar]) {
      document.getElementById(elementId).checked = true;
    } else {
      document.getElementById(elementId).checked = false;
    }
  }).catch((e) => console.error(e));
}


// used to restore selected options from local storage: first is the name of the variable
// in chrome local storage, second the html id of the checkbox
const puzzleArray = ['block_puzzle_streak', 'block-streak', 'block_puzzle_storm', 'block-storm', 'block_puzzle_racer', 'block-racer']

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('save').addEventListener('click',
  saveOptions);
