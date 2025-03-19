#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include <TFT_eSPI.h>

class DisplayManager {
public:
    // Constructor
    DisplayManager();
    
    // Initialize the display
    bool begin();
    
    // Clear the display
    void clear();
    
    // Draw text at position with color
    void drawText(const char* text, int x, int y, uint16_t color = TFT_WHITE, uint8_t size = 1);
    
    // Draw a button with text
    void drawButton(const char* text, int x, int y, int width, int height, uint16_t buttonColor, uint16_t textColor = TFT_WHITE);
    
    // Draw a progress bar
    void drawProgressBar(int x, int y, int width, int height, uint8_t progress, uint16_t fgColor, uint16_t bgColor);
    
    // Draw the time
    void drawTime(int x, int y, int hour, int minute, int second = -1, uint16_t color = TFT_WHITE, uint8_t size = 2);
    
    // Draw the date
    void drawDate(int x, int y, int day, int month, int year, uint16_t color = TFT_WHITE, uint8_t size = 1);
    
    // Draw battery status
    void drawBattery(int x, int y, uint8_t percentage, uint16_t color = TFT_WHITE);
    
    // Get the TFT object (for advanced usage)
    TFT_eSPI* getTFT();
    
private:
    TFT_eSPI _tft;
};

#endif // DISPLAY_MANAGER_H