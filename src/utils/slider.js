const SliderUtils = {
    /**
     * Applies constraints to the time slider based on user settings.
     * @param {HTMLElement} timeSlider - The time slider (minutes).
     * @param {HTMLElement} incSlider - The increment slider.
     * @param {object} settings - The user settings from storage.
     */
    applyConstraints: function(timeSlider, incSlider, settings) {
        if (!timeSlider) return;
        
        // determine Minimum Time Slider Value
        const minIndex = TimeControlUtils.getMinTimeIndex(settings);
        timeSlider.min = minIndex;
    
        // enforce current value & enforce update
        if (parseInt(timeSlider.value) < minIndex) {
            timeSlider.value = minIndex; 
        } 
        this._triggerEvent(timeSlider);
    
        // hadle increment slider
        if (incSlider && settings['blitz_mode'] === 'custom') {
            const rule = settings['blitz_custom_rule'] || { minutes: 3, increment: 0, operator: 'AND' };
            const operator = rule.operator || 'AND';
    
            if (operator === 'AND') {
                 // If AND logic, ensure minimum increment as well
                 const minInc = TimeControlUtils.getMinIncrement(settings);
                 incSlider.min = minInc;
    
                 if (parseInt(incSlider.value) < minInc) {
                     incSlider.value = minInc;
                 }
                 this._triggerEvent(incSlider);
            }
        }
    },
    
    /**
     * Dispatch events on the slider so internal React/Mithril state updates.
     */
    _triggerEvent: function(slider) {
        if (!slider) return;
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
    }
};
