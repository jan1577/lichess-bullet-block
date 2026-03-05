const LobbyUtils = {
    /**
     * Processes a single game row in the lobby (real-time table).
     * @param {HTMLElement} row - The <tr> element representing a game.
     * @param {object} settings - The user settings.
     */
    processRow: function(row, settings) {
        if (!row) return;
        
        let game_title = row.title || "";
        
        // extract time control from game title
        let tcStr = TimeControlUtils.extractTimeControl(game_title);
        
        // If title doesn't contain a time control, look in the <td> cells
        if (!tcStr) {
            const cells = row.getElementsByTagName('td');
            for (let i = 0; i < cells.length; i++) {
                const cellText = cells[i].textContent.trim();
                // Check for special characters (½, ¼) or standard time control format
                if (cellText.includes('½') || cellText.includes('¼') || TimeControlUtils.TIME_CONTROL_RE.test(cellText)) {
                    tcStr = cellText;
                    break;
                }
            }
        }
        
        if (tcStr) {
            const isAllowed = TimeControlUtils.isGameAllowed(tcStr, settings);
            if (!isAllowed) {
                row.style.display = "none";
            }
        } else if (game_title.includes("Bullet")) {
            // Bullet is always blocked
            row.style.display = "none";
        } else if (game_title.includes("Blitz") && settings['blitz_mode'] === 'yes') {
            // Block all blitz when blitz_mode is 'yes'
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
            button.style.display = "none";
            return;
        }

        if (!TimeControlUtils.isGameAllowed(text, settings)) {
             button.style.display = "none";
             return;
        }
    }
};
