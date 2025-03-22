// This is a simple test to display "Hello World" on the ESP32-S3 AI Smartwatch simulator

// Create instance of DisplayManager
const displayManager = new DisplayManager();

function setup() {
  // Initialize logger
  Logger.begin("TEST");
  Logger.info("Starting display test...");
  
  // Initialize display
  if (!displayManager.begin()) {
    Logger.error("Failed to initialize display!");
    return;
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
  
  Logger.info("Test display complete");
}

// Start the test when the page loads
window.addEventListener('load', setup);
