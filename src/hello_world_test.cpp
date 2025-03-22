#include <Arduino.h>
#include "DisplayManager.h"
#include "Logger.h"

// Create instance of DisplayManager
DisplayManager displayManager;

void setup() {
  // Initialize serial for debugging
  Serial.begin(115200);
  delay(100);
  
  // Initialize logger
  Logger::begin("TEST");
  LOG_I("Starting display test...");
  
  // Initialize display
  if (!displayManager.begin()) {
    LOG_E("Failed to initialize display!");
    while (1) delay(100); // Halt if display init fails
  }
  
  // Clear the display
  displayManager.clear();
  
  // Draw welcome message
  displayManager.drawText("Hello, World!", 10, 10, TFT_WHITE, 2);
  displayManager.drawText("ESP32-S3 AI Smartwatch", 10, 40, TFT_GREEN, 1);
  
  // Draw a battery indicator
  displayManager.drawBattery(180, 10, 75);
  
  // Draw current time (placeholder)
  displayManager.drawTime(60, 80, 12, 34, 56, TFT_CYAN, 2);
  
  // Draw a button
  displayManager.drawButton("Test Button", 50, 110, 140, 30, TFT_BLUE, TFT_WHITE);
  
  LOG_I("Test display complete");
}

void loop() {
  // Nothing to do in the loop for this test
  delay(100);
}
