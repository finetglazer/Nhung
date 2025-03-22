#include "DisplayManager.h"
#include "Config.h"
#include "Logger.h"

// Constructor
DisplayManager::DisplayManager() {
    // Nothing to initialize in constructor
}

// Initialize the display
bool DisplayManager::begin() {
    // Initialize the logger for display-related messages
    Logger::begin("DISPLAY");
    LOG_I("Initializing display...");
    
    // Initialize the TFT display
    _tft.init();
    
    // Set the default rotation (0=0°, 1=90°, 2=180°, 3=270°)
    _tft.setRotation(1); // Landscape orientation
    
    // Initialize the backlight
    pinMode(PIN_TFT_BACKLIGHT, OUTPUT);
    digitalWrite(PIN_TFT_BACKLIGHT, TFT_BACKLIGHT_ON);
    
    // Clear the screen to black
    _tft.fillScreen(TFT_BLACK);
    
    LOG_I("Display initialized successfully");
    return true;
}

// Clear the display
void DisplayManager::clear() {
    _tft.fillScreen(TFT_BLACK);
}

// Draw text at position with color
void DisplayManager::drawText(const char* text, int x, int y, uint16_t color, uint8_t size) {
    _tft.setTextColor(color);
    _tft.setTextSize(size);
    _tft.setCursor(x, y);
    _tft.print(text);
}

// Draw a button with text
void DisplayManager::drawButton(const char* text, int x, int y, int width, int height, 
                               uint16_t buttonColor, uint16_t textColor) {
    // Draw button background
    _tft.fillRoundRect(x, y, width, height, 5, buttonColor);
    
    // Draw button border
    _tft.drawRoundRect(x, y, width, height, 5, textColor);
    
    // Calculate text position for centering
    _tft.setTextSize(1);
    int16_t textX = x + (width - strlen(text) * 6) / 2;
    int16_t textY = y + (height - 8) / 2;
    
    // Draw text
    drawText(text, textX, textY, textColor);
}

// Draw a progress bar
void DisplayManager::drawProgressBar(int x, int y, int width, int height, 
                                    uint8_t progress, uint16_t fgColor, uint16_t bgColor) {
    // Ensure progress is between 0 and 100
    if (progress > 100) progress = 100;
    
    // Draw background
    _tft.fillRect(x, y, width, height, bgColor);
    
    // Calculate progress width
    int progressWidth = (width * progress) / 100;
    
    // Draw progress
    if (progressWidth > 0) {
        _tft.fillRect(x, y, progressWidth, height, fgColor);
    }
    
    // Draw border
    _tft.drawRect(x, y, width, height, TFT_WHITE);
}

// Draw the time
void DisplayManager::drawTime(int x, int y, int hour, int minute, int second, 
                             uint16_t color, uint8_t size) {
    char timeStr[9]; // HH:MM:SS\0
    
    if (second >= 0) {
        sprintf(timeStr, "%02d:%02d:%02d", hour, minute, second);
    } else {
        sprintf(timeStr, "%02d:%02d", hour, minute);
    }
    
    drawText(timeStr, x, y, color, size);
}

// Draw the date
void DisplayManager::drawDate(int x, int y, int day, int month, int year, 
                             uint16_t color, uint8_t size) {
    char dateStr[11]; // DD/MM/YYYY\0
    sprintf(dateStr, "%02d/%02d/%04d", day, month, year);
    
    drawText(dateStr, x, y, color, size);
}

// Draw battery status
void DisplayManager::drawBattery(int x, int y, uint8_t percentage, uint16_t color) {
    // Define battery dimensions
    const int batteryWidth = 25;
    const int batteryHeight = 12;
    const int terminalWidth = 2;
    const int terminalHeight = 6;
    
    // Draw battery body outline
    _tft.drawRect(x, y, batteryWidth, batteryHeight, color);
    
    // Draw battery terminal
    _tft.fillRect(x + batteryWidth, y + (batteryHeight - terminalHeight) / 2, 
                  terminalWidth, terminalHeight, color);
    
    // Calculate fill width based on percentage
    int fillWidth = ((batteryWidth - 2) * percentage) / 100;
    
    // Choose fill color based on battery level
    uint16_t fillColor;
    if (percentage <= 20) {
        fillColor = TFT_RED;
    } else if (percentage <= 50) {
        fillColor = TFT_YELLOW;
    } else {
        fillColor = TFT_GREEN;
    }
    
    // Draw battery fill level
    if (fillWidth > 0) {
        _tft.fillRect(x + 1, y + 1, fillWidth, batteryHeight - 2, fillColor);
    }
    
    // Draw percentage text if there's enough room
    if (batteryWidth >= 20) {
        char percentStr[5];
        sprintf(percentStr, "%d%%", percentage);
        
        // Set small text size
        _tft.setTextSize(1);
        _tft.setTextColor(TFT_WHITE);
        
        // Calculate text position to center in battery
        int16_t textX = x + 3;
        int16_t textY = y + (batteryHeight - 6) / 2;
        
        _tft.setCursor(textX, textY);
        _tft.print(percentStr);
    }
}

// Get the TFT object (for advanced usage)
TFT_eSPI* DisplayManager::getTFT() {
    return &_tft;
}
