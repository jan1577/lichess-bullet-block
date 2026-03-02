/**
 * Mapping from Lichess slider index to minutes.
 * source: ui/lib/src/setup/timeControl.ts
 */
const SLIDER_TIME_MAPPING = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const MIN_BLITZ_INDEX = 7; // Index for 3 minutes
const MIN_RAPID_INDEX = 12; // Index for 8 minutes

const TimeControlUtils = {
  /** Safe regex for matching time controls like "3+0" or "10+5". */
  TIME_CONTROL_RE: /\b(\d{1,4})\+(\d{1,4})\b/,

  /**
   * Extracts a time control string (e.g., "3+0") from arbitrary text.
   * @param {string} text - Text that may contain a time control.
   * @returns {string|null} - The matched substring or null.
   */
  extractTimeControl: function(text) {
    if (!text) return null;
    const match = text.match(this.TIME_CONTROL_RE);
    return match ? match[0] : null;
  },

  /**
   * Parses a time control string (e.g., "3+2") into minutes and increment.
   * @param {string} text - The time control string.
   * @returns {object|null} - { minutes, increment } or null if invalid.
   */
  parseTimeControl: function(text) {
    if (!text) return null;
    // Handle "½" and "¼" specific to Lichess bullet
    if (text.includes('½') || text.includes('¼')) {
      return { minutes: 0.5, increment: 0 }; // Treat as bullet
    }
    
    // Check for standard format "3+0"
    const parts = text.split('+');
    if (parts.length === 2) {
      const minutes = parseFloat(parts[0]);
      const increment = parseInt(parts[1]);
      if (!isNaN(minutes) && !isNaN(increment)) {
        return { minutes, increment };
      }
    }
    
    // Fallback for title parsing (e.g. "Rated Blitz game 5+0")
    const match = text.match(this.TIME_CONTROL_RE);
    if (match) {
      return {
        minutes: parseInt(match[1]),
        increment: parseInt(match[2])
      };
    }
    
    return null;
  },

  /**
   * Determines if a game is Bullet.
   */
  isBullet: function(minutes, increment) {
      if (minutes < 3) return true;
      return false;
  },

  /**
   * Determines if a game is Blitz.
   */
  isBlitz: function(minutes, increment) {
      if (minutes >= 3 && minutes < 8) return true;
      return false;
  },

  /**
   * Checks if a game is allowed based on user settings.
   * @param {string} text - Time control string (e.g., "3+2" or title).
   * @param {object} settings - The settings object from storage.
   * @returns {boolean} - True if allowed, False if blocked.
   */
  isGameAllowed: function(text, settings) {
    if (!text) return true;
    
    const tc = this.parseTimeControl(text);
    if (!tc) return true; // Can't parse, default to allow to avoid breaking UI

    if (this.isBullet(tc.minutes, tc.increment)) {
      return false; 
    }

    if (!this.isBlitz(tc.minutes, tc.increment)) {
      return true;
    }

    const mode = settings['blitz_mode'] || 'no';

    if (mode === 'yes') {
      return false; // Block all blitz
    }

    if (mode === 'custom') {
      const rule = settings['blitz_custom_rule'] || { minutes: 3, increment: 0, operator: 'AND' };
      const minMinutes = parseInt(rule.minutes);
      const minIncrement = parseInt(rule.increment);
      const operator = rule.operator || 'AND';

      const minOk = tc.minutes >= minMinutes;
      const incOk = tc.increment >= minIncrement;

      if (operator === 'AND') {
        return minOk && incOk;
      } else {
        return minOk || incOk;
      }
    }

    return true;
  },
  
  /**
   * Returns the minimum allowed slider index based on settings.
   */
  getMinTimeIndex: function(settings) {
    const mode = settings['blitz_mode'] || 'no';
    
    if (mode === 'yes') {
      return MIN_RAPID_INDEX;
    }
    
    if (mode === 'custom') {
      const rule = settings['blitz_custom_rule'] || { minutes: 3, increment: 0, operator: 'AND' };
      const minMinutes = parseInt(rule.minutes) || 3;
      
      for (let i = 0; i < SLIDER_TIME_MAPPING.length; i++) {
         if (SLIDER_TIME_MAPPING[i] >= minMinutes) {
             return i;
         }
      }
      return MIN_BLITZ_INDEX;
    }
    
    return MIN_BLITZ_INDEX; // Default: Block bullet (min 3 mins)
  },

  getMinIncrement: function(settings) {
    const mode = settings['blitz_mode'] || 'no';
    if (mode === 'custom') {
        const rule = settings['blitz_custom_rule'] || { minutes: 3, increment: 0, operator: 'AND' };
        if (rule.operator === 'AND') {
             let inc = parseInt(rule.increment);
             return isNaN(inc) ? 0 : Math.min(inc, 20);
        }
    }
    return 0;
  }
};
