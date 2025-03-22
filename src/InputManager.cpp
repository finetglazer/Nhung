#include "InputManager.h"
#include "Logger.h"

// Constructor
InputManager::InputManager() : _buttonsEnabled(true) {
    // Initialize button states
    for (int i = 0; i < MAX_BUTTONS; i++) {
        _buttons[i].pin = 0;
        _buttons[i].activeLow = true;
        _buttons[i].lastState = false;
        _buttons[i].currentState = false;
        _buttons[i].pressTime = 0;
        _buttons[i].longPressTriggered = false;
    }
}

// Initialize a button with the specified GPIO pin
void InputManager::registerButton(uint8_t buttonId, uint8_t pin, bool activeLow) {
    // Check if the buttonId is valid
    if (buttonId >= MAX_BUTTONS) {
        Logger::error("Invalid button ID: %d", buttonId);
        return;
    }
    
    // Initialize the button
    _buttons[buttonId].pin = pin;
    _buttons[buttonId].activeLow = activeLow;
    
    // Set initial state to not pressed
    _buttons[buttonId].lastState = false;
    _buttons[buttonId].currentState = false;
    _buttons[buttonId].pressTime = 0;
    _buttons[buttonId].longPressTriggered = false;
    
    // Configure the GPIO pin
    pinMode(pin, INPUT_PULLUP);
    
    Logger::debug("Registered button %d on pin %d (active %s)", 
                buttonId, pin, activeLow ? "LOW" : "HIGH");
}

// Set the callback function for button press events
void InputManager::setButtonPressCallback(ButtonCallback callback) {
    _buttonPressCallback = callback;
}

// Set the callback function for button long press events
void InputManager::setButtonLongPressCallback(ButtonCallback callback) {
    _buttonLongPressCallback = callback;
}

// Update function (to be called in the main loop)
void InputManager::update() {
    // Only check buttons if enabled
    if (!_buttonsEnabled) return;
    
    // Get current time for debounce and long press detection
    unsigned long now = millis();
    
    // Check each button
    for (uint8_t i = 0; i < MAX_BUTTONS; i++) {
        // Skip unregistered buttons
        if (_buttons[i].pin == 0) continue;
        
        // Read the current state of the button
        bool rawState = digitalRead(_buttons[i].pin);
        
        // Convert to logical state based on activeLow setting
        bool newState = _buttons[i].activeLow ? !rawState : rawState;
        
        // Check if button state has changed (with debounce)
        if (newState != _buttons[i].lastState) {
            // Update last state
            _buttons[i].lastState = newState;
            
            // Record press time on button press
            if (newState) {
                _buttons[i].pressTime = now;
                _buttons[i].longPressTriggered = false;
            }
            // Call button press callback on button release
            else {
                // Only trigger a press event if it wasn't a long press
                if (!_buttons[i].longPressTriggered && _buttonPressCallback) {
                    _buttonPressCallback(i);
                }
            }
        }
        
        // Check for long press
        if (_buttons[i].lastState && !_buttons[i].longPressTriggered &&
            (now - _buttons[i].pressTime >= _longPressTime)) {
            // Trigger long press callback
            if (_buttonLongPressCallback) {
                _buttonLongPressCallback(i);
            }
            
            // Mark as triggered so it doesn't repeat
            _buttons[i].longPressTriggered = true;
        }
        
        // Update current state
        _buttons[i].currentState = newState;
    }
}

// Check if a button is currently pressed
bool InputManager::isButtonPressed(uint8_t buttonId) {
    // Check if the buttonId is valid
    if (buttonId >= MAX_BUTTONS) {
        return false;
    }
    
    return _buttons[buttonId].currentState;
}

// Enable/disable button input
void InputManager::setButtonsEnabled(bool enabled) {
    _buttonsEnabled = enabled;
}
