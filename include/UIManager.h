#ifndef UI_MANAGER_H
#define UI_MANAGER_H

#include "DisplayManager.h"

// Forward declarations
class Screen;

class UIManager {
public:
    // Constructor
    UIManager(DisplayManager& displayManager);
    
    // Initialize the UI
    bool begin();
    
    // Set the active screen
    void setScreen(Screen* screen);
    
    // Get the current screen
    Screen* getCurrentScreen();
    
    // Update the UI (call in the main loop)
    void update();
    
    // Handle button press events
    void handleButtonPress(uint8_t buttonId);
    
    // Handle button long press events
    void handleButtonLongPress(uint8_t buttonId);
    
private:
    DisplayManager& _displayManager;
    Screen* _currentScreen;
    unsigned long _lastUpdateTime;
};

// Base class for all screens
class Screen {
public:
    // Constructor
    Screen(UIManager& uiManager, DisplayManager& displayManager);
    
    // Called when the screen becomes active
    virtual void onActivate() = 0;
    
    // Called when the screen is no longer active
    virtual void onDeactivate() = 0;
    
    // Update the screen content (called by UIManager::update)
    virtual void update() = 0;
    
    // Handle button press events
    virtual void handleButtonPress(uint8_t buttonId) = 0;
    
    // Handle button long press events
    virtual void handleButtonLongPress(uint8_t buttonId) = 0;
    
protected:
    UIManager& _uiManager;
    DisplayManager& _displayManager;
};

#endif // UI_MANAGER_H