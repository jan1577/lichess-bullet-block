const LobbyUtils = {
    /**
     * Processes a single game row in the lobby (real-time table).
     * @param {HTMLElement} row - The <tr> element representing a game.
     * @param {object} settings - The user settings.
     */
    processRow: function(row, settings) {
        if (!row || !row.title) return;
        
        let game_title = row.title;
        
        // extract time control from game title
        const tcStr = TimeControlUtils.extractTimeControl(game_title);
        let timeControl = "";
        
        if (tcStr) {
            timeControl = tcStr;
        } else if (game_title.includes("Bullet")) {
            // Bullet is always blocked
            row.style.display = "none";
            return;
        } else {
            // Can't determine from title -> fallback or ignore
            // Check if user has blitz blocked entirely
            if (game_title.includes("Blitz") && settings['blitz_mode'] === 'yes') {
                 row.style.display = "none";
                 return;
            }
            return;
        }

        const isAllowed = TimeControlUtils.isGameAllowed(timeControl, settings);
        
        if (!isAllowed) {
            row.style.display = "none";
        }
    },

    /**
     * Processes a Quick Pairing button (e.g., "1+0", "3+2").
     * @param {HTMLElement} button - The button element.
     * @param {object} settings - The user settings.
     */
    processQuickPairingButton: function(button, settings) {
        if (!button) return;
        const text = button.textContent.trim();

        // Explicit Check for Bullet
        const tc = TimeControlUtils.parseTimeControl(text);
        if (tc && TimeControlUtils.isBullet(tc.minutes, tc.increment)) {
            button.remove();
            return;
        }

        if (!TimeControlUtils.isGameAllowed(text, settings)) {
             button.remove();
             return;
        }
    }
};
