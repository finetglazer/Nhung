#ifndef CONFIG_H
#define CONFIG_H

// Version information
#define APP_VERSION "0.1.0"
#define APP_NAME "ESP32-S3 AI Smartwatch"

// Debug configuration
#define DEBUG_ENABLED 1
#define LOG_LEVEL LOG_LEVEL_DEBUG  // See Logger.h for levels

// Hardware pins
// Button pins (change based on your wiring)
#define PIN_BUTTON_UP      14  // UP button GPIO pin
#define PIN_BUTTON_DOWN    21  // DOWN button GPIO pin
#define PIN_BUTTON_SELECT  38  // SELECT button GPIO pin

// Battery monitoring
#define PIN_BATTERY_LEVEL  34  // Battery level ADC pin
#define BATTERY_MIN_VOLTAGE 3.3  // Minimum battery voltage
#define BATTERY_MAX_VOLTAGE 4.2  // Maximum battery voltage

// Display backlight control
#define PIN_TFT_BACKLIGHT  45  // TFT backlight control pin
#define TFT_BACKLIGHT_ON   HIGH
#define TFT_BACKLIGHT_OFF  LOW

// Power management
#define AUTO_SLEEP_TIMEOUT_MS 60000  // Auto sleep after 1 minute of inactivity
#define DISPLAY_TIMEOUT_MS    30000  // Dim display after 30 seconds

// UI settings
#define UI_UPDATE_INTERVAL_MS 50     // UI update interval in milliseconds
#define CLOCK_UPDATE_INTERVAL_MS 1000 // Clock update interval in milliseconds

// WiFi settings
#define WIFI_SSID "YourWiFiSSID"
#define WIFI_PASSWORD "YourWiFiPassword"
#define WIFI_CONNECT_TIMEOUT_MS 10000 // WiFi connection timeout

// Server settings
#define SERVER_URL "https://your-api-server.com/api"
#define API_KEY "your-api-key-here"

#endif // CONFIG_H