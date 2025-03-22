#include "UIManager.h"
#include "Logger.h"
#include "Config.h"

// UIManager Constructor
UIManager::UIManager(DisplayManager& displayManager)
    : _displayManager(displayManager), _currentScreen(nullptr), _lastUpdateTime(0) {
}

// Initialize the UI
bool UIManager::begin() {
    // Initialize the logger for UI-related messages
    Logger::begin("UI");
    LOG_I("Initializing UI manager...");
    
    // We'll initialize with no screen set
    _currentScreen = nullptr;
    
    LOG_I("UI manager initialized successfully");
    return true;
}

// Set the active screen
void UIManager::setScreen(Screen* screen) {
    // If there's a current screen, deactivate it
    if (_currentScreen != nullptr) {
        LOG_D("Deactivating screen");
        _currentScreen->onDeactivate();
    }
    
    // Set the new screen
    _currentScreen = screen;
    
    // If there's a new screen, activate it
    if (_currentScreen != nullptr) {
        LOG_D("Activating new screen");
        _currentScreen->onActivate();
    }
}

// Get the current screen
Screen* UIManager::getCurrentScreen() {
    return _currentScreen;
}

// Update the UI (call in the main loop)
void UIManager::update() {
    // Get current time
    unsigned long currentTime = millis();
    
    // Check if it's time to update based on UI_UPDATE_INTERVAL_MS
    if (currentTime - _lastUpdateTime >= UI_UPDATE_INTERVAL_MS) {
        // Update the last update time
        _lastUpdateTime = currentTime;
        
        // If there's a current screen, update it
        if (_currentScreen != nullptr) {
            _currentScreen->update();
        }
    }
}

// Handle button press events
void UIManager::handleButtonPress(uint8_t buttonId) {
    // Forward to current screen if it exists
    if (_currentScreen != nullptr) {
        _currentScreen->handleButtonPress(buttonId);
    }
}

// Handle button long press events
void UIManager::handleButtonLongPress(uint8_t buttonId) {
    // Forward to current screen if it exists
    if (_currentScreen != nullptr) {
        _currentScreen->handleButtonLongPress(buttonId);
    }
}

// Screen base class constructor
Screen::Screen(UIManager& uiManager, DisplayManager& displayManager)
    : _uiManager(uiManager), _displayManager(displayManager) {
}
