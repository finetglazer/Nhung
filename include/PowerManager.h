#ifndef POWER_MANAGER_H
#define POWER_MANAGER_H

#include <Arduino.h>

class PowerManager {
public:
    // Constructor
    PowerManager(uint8_t batteryPin = 34);
    
    // Initialize the power management system
    bool begin();
    
    // Get the current battery percentage (0-100)
    uint8_t getBatteryPercentage();
    
    // Get the battery voltage
    float getBatteryVoltage();
    
    // Enter deep sleep mode for a specified time
    void deepSleep(uint64_t sleepTimeMs);
    
    // Enter light sleep mode for a specified time
    void lightSleep(uint64_t sleepTimeMs);
    
    // Define wake-up sources (buttons, timer, etc.)
    void setWakeupSources(uint8_t gpio_pin, bool high_level = true);
    
    // Check if the device just woke up from sleep
    bool isWakeFromDeepSleep();
    
    // Enable/disable automatic sleep when inactive
    void setAutoSleep(bool enable, uint64_t inactivityTimeMs = 60000);
    
    // Reset the inactivity timer (call this when user interaction occurs)
    void resetInactivityTimer();
    
    // Update function (to be called in the main loop)
    void update();
    
private:
    uint8_t _batteryPin;
    float _batteryVoltage;
    uint8_t _batteryPercentage;
    unsigned long _lastBatteryReadTime;
    unsigned long _lastActivityTime;
    bool _autoSleepEnabled;
    uint64_t _inactivityTimeMs;
    
    // Read the battery voltage and update percentage
    void _updateBatteryStatus();
    
    // Convert voltage to percentage based on battery discharge curve
    uint8_t _voltageToPercentage(float voltage);
};

#endif // POWER_MANAGER_H