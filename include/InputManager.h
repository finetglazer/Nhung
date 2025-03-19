#ifndef INPUT_MANAGER_H
#define INPUT_MANAGER_H

#include <Arduino.h>
#include <functional>

// Button IDs
#define BUTTON_UP    0
#define BUTTON_DOWN  1
#define BUTTON_SELECT 2

// Maximum number of buttons supported
#define MAX_BUTTONS 4

// Button press callback function type
typedef std::function<void(uint8_t)> ButtonCallback;

class InputManager {
public:
    // Constructor
    InputManager();
    
    // Initialize a button with the specified GPIO pin
    void registerButton(uint8_t buttonId, uint8_t pin, bool activeLow = true);
    
    // Set the callback function for button press events
    void setButtonPressCallback(ButtonCallback callback);
    
    // Set the callback function for button long press events
    void setButtonLongPressCallback(ButtonCallback callback);
    
    // Update function (to be called in the main loop)
    void update();
    
    // Check if a button is currently pressed
    bool isButtonPressed(uint8_t buttonId);
    
    // Enable/disable button input
    void setButtonsEnabled(bool enabled);
    
private:
    struct ButtonState {
        uint8_t pin;
        bool activeLow;
        bool lastState;
        bool currentState;
        unsigned long pressTime;
        bool longPressTriggered;
    };
    
    ButtonState _buttons[MAX_BUTTONS];
    ButtonCallback _buttonPressCallback;
    ButtonCallback _buttonLongPressCallback;
    bool _buttonsEnabled;
    const unsigned long _debounceTime = 50;    // Debounce time in milliseconds
    const unsigned long _longPressTime = 1000; // Long press threshold in milliseconds
};

#endif // INPUT_MANAGER_H