// This file adapts your ESP32 C++ classes to JavaScript for the simulator

// Constants from Config.h
const CONFIG = {
  APP_VERSION: "0.1.0",
  APP_NAME: "ESP32-S3 AI Smartwatch",
  
  // Button pins
  PIN_BUTTON_UP: 14,
  PIN_BUTTON_DOWN: 21,
  PIN_BUTTON_SELECT: 38,
  
  // Battery
  PIN_BATTERY_LEVEL: 34,
  BATTERY_MIN_VOLTAGE: 3.3,
  BATTERY_MAX_VOLTAGE: 4.2,
  
  // Display
  PIN_TFT_BACKLIGHT: 45,
  TFT_BACKLIGHT_ON: 1,
  TFT_BACKLIGHT_OFF: 0,
  
  // Power management
  AUTO_SLEEP_TIMEOUT_MS: 60000,
  DISPLAY_TIMEOUT_MS: 30000,
  
  // UI settings
  UI_UPDATE_INTERVAL_MS: 50,
  CLOCK_UPDATE_INTERVAL_MS: 1000
};

// TFT Color constants
const TFT_BLACK = '#000000';
const TFT_WHITE = '#FFFFFF';
const TFT_RED = '#FF0000';
const TFT_GREEN = '#00FF00';
const TFT_BLUE = '#0000FF';
const TFT_YELLOW = '#FFFF00';
const TFT_CYAN = '#00FFFF';

// Logger class implementation
class Logger {
  static _tag = "APP";
  static _logLevel = 3; // LOG_LEVEL_INFO
  
  static begin(tag, level = 3) {
    this._tag = tag;
    this._logLevel = level;
    console.log(`Logger initialized with tag: ${tag}, level: ${level}`);
  }
  
  static error(format, ...args) {
    if (this._logLevel >= 1) {
      this._log(1, "E", format, args);
    }
  }
  
  static warning(format, ...args) {
    if (this._logLevel >= 2) {
      this._log(2, "W", format, args);
    }
  }
  
  static info(format, ...args) {
    if (this._logLevel >= 3) {
      this._log(3, "I", format, args);
    }
  }
  
  static debug(format, ...args) {
    if (this._logLevel >= 4) {
      this._log(4, "D", format, args);
    }
  }
  
  static verbose(format, ...args) {
    if (this._logLevel >= 5) {
      this._log(5, "V", format, args);
    }
  }
  
  static setLogLevel(level) {
    this._logLevel = level;
  }
  
  static getLogLevel() {
    return this._logLevel;
  }
  
  static _log(level, levelStr, format, args) {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ms = now.getMilliseconds().toString().padStart(3, '0');
    
    // Format the message
    let message = format;
    if (args && args.length > 0) {
      // Simple string formatting (not as powerful as sprintf but works for basic cases)
      args.forEach((arg, index) => {
        message = message.replace(`%${index + 1}`, arg);
      });
    }
    
    // Log to the simulator's log
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
      const logEntry = document.createElement('div');
      logEntry.textContent = `[${hours}:${minutes}:${seconds}.${ms}][${this._tag}][${levelStr}] ${message}`;
      
      // Color based on log level
      if (levelStr === 'E') logEntry.style.color = '#f88';
      else if (levelStr === 'W') logEntry.style.color = '#ff8';
      else if (levelStr === 'D') logEntry.style.color = '#8cf';
      
      logContainer.appendChild(logEntry);
      logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    // Also log to console for debugging
    console.log(`[${hours}:${minutes}:${seconds}.${ms}][${this._tag}][${levelStr}] ${message}`);
  }
}

// DisplayManager class adapter
class DisplayManager {
  constructor() {
    this._canvas = null;
    this._ctx = null;
  }
  
  begin() {
    Logger.begin("DISPLAY");
    Logger.info("Initializing display...");
    
    this._canvas = document.getElementById('display');
    if (!this._canvas) {
      Logger.error("Failed to get display canvas");
      return false;
    }
    
    this._ctx = this._canvas.getContext('2d');
    if (!this._ctx) {
      Logger.error("Failed to get canvas context");
      return false;
    }
    
    // Set default rotation (landscape)
    // This doesn't do anything in the web version but kept for compatibility
    
    // Clear the screen to black
    this.clear();
    
    Logger.info("Display initialized successfully");
    return true;
  }
  
  clear() {
    if (this._ctx) {
      this._ctx.fillStyle = TFT_BLACK;
      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }
  
  drawText(text, x, y, color = TFT_WHITE, size = 1) {
    if (!this._ctx) return;
    
    this._ctx.fillStyle = color;
    this._ctx.font = `${12 * size}px Arial`;
    this._ctx.fillText(text, x, y + 12 * size); // Adjust y for baseline
  }
  
  drawButton(text, x, y, width, height, buttonColor, textColor = TFT_WHITE) {
    if (!this._ctx) return;
    
    // Draw button background
    this._ctx.fillStyle = buttonColor;
    this._ctx.beginPath();
    this._ctx.roundRect(x, y, width, height, 5);
    this._ctx.fill();
    
    // Draw button border
    this._ctx.strokeStyle = textColor;
    this._ctx.beginPath();
    this._ctx.roundRect(x, y, width, height, 5);
    this._ctx.stroke();
    
    // Calculate text position for centering
    this._ctx.font = '12px Arial';
    const textWidth = this._ctx.measureText(text).width;
    const textX = x + (width - textWidth) / 2;
    const textY = y + (height + 12) / 2;
    
    // Draw text
    this._ctx.fillStyle = textColor;
    this._ctx.fillText(text, textX, textY);
  }
  
  drawProgressBar(x, y, width, height, progress, fgColor, bgColor) {
    if (!this._ctx) return;
    
    // Ensure progress is between 0 and 100
    progress = Math.min(Math.max(progress, 0), 100);
    
    // Draw background
    this._ctx.fillStyle = bgColor;
    this._ctx.fillRect(x, y, width, height);
    
    // Calculate progress width
    const progressWidth = (width * progress) / 100;
    
    // Draw progress
    if (progressWidth > 0) {
      this._ctx.fillStyle = fgColor;
      this._ctx.fillRect(x, y, progressWidth, height);
    }
    
    // Draw border
    this._ctx.strokeStyle = TFT_WHITE;
    this._ctx.strokeRect(x, y, width, height);
  }
  
  drawTime(x, y, hour, minute, second = -1, color = TFT_WHITE, size = 2) {
    if (!this._ctx) return;
    
    let timeStr;
    if (second >= 0) {
      timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    } else {
      timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    this.drawText(timeStr, x, y, color, size);
  }
  
  drawDate(x, y, day, month, year, color = TFT_WHITE, size = 1) {
    if (!this._ctx) return;
    
    const dateStr = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
    this.drawText(dateStr, x, y, color, size);
  }
  
  drawBattery(x, y, percentage, color = TFT_WHITE) {
    if (!this._ctx) return;
    
    // Define battery dimensions
    const batteryWidth = 25;
    const batteryHeight = 12;
    const terminalWidth = 2;
    const terminalHeight = 6;
    
    // Draw battery body outline
    this._ctx.strokeStyle = color;
    this._ctx.strokeRect(x, y, batteryWidth, batteryHeight);
    
    // Draw battery terminal
    this._ctx.fillStyle = color;
    this._ctx.fillRect(x + batteryWidth, y + (batteryHeight - terminalHeight) / 2, 
                  terminalWidth, terminalHeight);
    
    // Calculate fill width based on percentage
    const fillWidth = ((batteryWidth - 2) * percentage) / 100;
    
    // Choose fill color based on battery level
    let fillColor;
    if (percentage <= 20) {
      fillColor = TFT_RED;
    } else if (percentage <= 50) {
      fillColor = TFT_YELLOW;
    } else {
      fillColor = TFT_GREEN;
    }
    
    // Draw battery fill level
    if (fillWidth > 0) {
      this._ctx.fillStyle = fillColor;
      this._ctx.fillRect(x + 1, y + 1, fillWidth, batteryHeight - 2);
    }
    
    // Draw percentage text if there's enough room
    if (batteryWidth >= 20) {
      this._ctx.fillStyle = TFT_WHITE;
      this._ctx.font = '10px Arial';
      this._ctx.fillText(`${percentage}%`, x + 3, y + (batteryHeight + 8) / 2);
    }
  }
  
  // Placeholder for getTFT() that would return the TFT object in C++
  getTFT() {
    return null; // We don't need to implement this for the simulator
  }
}

// PowerManager class adapter
class PowerManager {
  constructor(batteryPin = CONFIG.PIN_BATTERY_LEVEL) {
    this._batteryPin = batteryPin;
    this._batteryVoltage = 0;
    this._batteryPercentage = 0;
    this._lastBatteryReadTime = 0;
    this._lastActivityTime = Date.now();
    this._autoSleepEnabled = false;
    this._inactivityTimeMs = CONFIG.AUTO_SLEEP_TIMEOUT_MS;
  }
  
  begin() {
    Logger.begin("POWER");
    Logger.info("Initializing power management...");
    
    // Set initial battery level from the simulator slider
    const batterySlider = document.getElementById('battery-level');
    if (batterySlider) {
      this._batteryPercentage = parseInt(batterySlider.value);
      this._batteryVoltage = this._percentageToVoltage(this._batteryPercentage);
    } else {
      this._batteryPercentage = 75; // Default
      this._batteryVoltage = this._percentageToVoltage(this._batteryPercentage);
    }
    
    // Listen for battery slider changes
    if (batterySlider) {
      batterySlider.addEventListener('input', () => {
        this._batteryPercentage = parseInt(batterySlider.value);
        this._batteryVoltage = this._percentageToVoltage(this._batteryPercentage);
        document.getElementById('battery-percentage').textContent = `${this._batteryPercentage}%`;
      });
    }
    
    Logger.info("Power management initialized with battery level: " + this._batteryPercentage + "%");
    return true;
  }
  
  getBatteryPercentage() {
    return this._batteryPercentage;
  }
  
  getBatteryVoltage() {
    return this._batteryVoltage;
  }
  
  deepSleep(sleepTimeMs) {
    Logger.info(`Entering deep sleep for ${sleepTimeMs}ms`);
    // In the simulator, we'll just display a message
    alert(`Device would enter deep sleep for ${sleepTimeMs}ms`);
  }
  
  lightSleep(sleepTimeMs) {
    Logger.info(`Entering light sleep for ${sleepTimeMs}ms`);
    // In the simulator, we'll just display a message
    alert(`Device would enter light sleep for ${sleepTimeMs}ms`);
  }
  
  setWakeupSources(gpio_pin, high_level = true) {
    Logger.debug(`Set wakeup source: GPIO ${gpio_pin}, high level: ${high_level}`);
    // Just log this in the simulator
  }
  
  isWakeFromDeepSleep() {
    return false; // Always false in simulator
  }
  
  setAutoSleep(enable, inactivityTimeMs = 60000) {
    this._autoSleepEnabled = enable;
    this._inactivityTimeMs = inactivityTimeMs;
    Logger.info(`Auto sleep ${enable ? 'enabled' : 'disabled'} with timeout ${inactivityTimeMs}ms`);
  }
  
  resetInactivityTimer() {
    this._lastActivityTime = Date.now();
    Logger.debug("Inactivity timer reset");
  }
  
  update() {
    const now = Date.now();
    
    // Update battery status occasionally
    if (now - this._lastBatteryReadTime > 5000) {
      this._updateBatteryStatus();
      this._lastBatteryReadTime = now;
    }
    
    // Check for auto sleep
    if (this._autoSleepEnabled && (now - this._lastActivityTime > this._inactivityTimeMs)) {
      Logger.info("Inactivity timeout reached, would enter sleep mode");
      // In the simulator, just reset the timer instead of sleeping
      this.resetInactivityTimer();
    }
  }
  
  _updateBatteryStatus() {
    // In the simulator, we get the battery percentage from the slider
    const batterySlider = document.getElementById('battery-level');
    if (batterySlider) {
      this._batteryPercentage = parseInt(batterySlider.value);
      this._batteryVoltage = this._percentageToVoltage(this._batteryPercentage);
    }
  }
  
  _percentageToVoltage(percentage) {
    // Convert percentage to voltage based on battery discharge curve
    return CONFIG.BATTERY_MIN_VOLTAGE + 
           (percentage / 100) * (CONFIG.BATTERY_MAX_VOLTAGE - CONFIG.BATTERY_MIN_VOLTAGE);
  }
  
  // C++ version has this, but in JS we go the other direction
  _voltageToPercentage(voltage) {
    const percentage = ((voltage - CONFIG.BATTERY_MIN_VOLTAGE) / 
                       (CONFIG.BATTERY_MAX_VOLTAGE - CONFIG.BATTERY_MIN_VOLTAGE)) * 100;
    return Math.max(0, Math.min(100, Math.round(percentage)));
  }
}

// InputManager class adapter
class InputManager {
  constructor() {
    this._buttons = Array(4).fill().map(() => ({
      pin: 0,
      activeLow: true,
      lastState: false,
      currentState: false,
      pressTime: 0,
      longPressTriggered: false
    }));
    
    this._buttonPressCallback = null;
    this._buttonLongPressCallback = null;
    this._buttonsEnabled = true;
    this._debounceTime = 50;
    this._longPressTime = 1000;
  }
  
  registerButton(buttonId, pin, activeLow = true) {
    if (buttonId >= this._buttons.length) {
      Logger.error(`Invalid button ID: ${buttonId}`);
      return;
    }
    
    this._buttons[buttonId].pin = pin;
    this._buttons[buttonId].activeLow = activeLow;
    this._buttons[buttonId].lastState = false;
    this._buttons[buttonId].currentState = false;
    this._buttons[buttonId].pressTime = 0;
    this._buttons[buttonId].longPressTriggered = false;
    
    Logger.debug(`Registered button ${buttonId} on pin ${pin} (active ${activeLow ? "LOW" : "HIGH"})`);
    
    // In the simulator, we'll use the button elements
    const buttonElements = [
      document.getElementById('btn-up'),      // BUTTON_UP (0)
      document.getElementById('btn-down'),    // BUTTON_DOWN (1)
      document.getElementById('btn-select')   // BUTTON_SELECT (2)
    ];
    
    if (buttonElements[buttonId]) {
      // Handle button press
      buttonElements[buttonId].addEventListener('mousedown', () => {
        if (!this._buttonsEnabled) return;
        
        const now = Date.now();
        this._buttons[buttonId].lastState = true;
        this._buttons[buttonId].currentState = true;
        this._buttons[buttonId].pressTime = now;
        this._buttons[buttonId].longPressTriggered = false;
        
        // Start long press timer
        const longPressTimer = setTimeout(() => {
          if (this._buttons[buttonId].currentState && !this._buttons[buttonId].longPressTriggered) {
            this._buttons[buttonId].longPressTriggered = true;
            if (this._buttonLongPressCallback) {
              this._buttonLongPressCallback(buttonId);
            }
          }
        }, this._longPressTime);
        
        // Handle button release
        const handleMouseUp = () => {
          if (!this._buttonsEnabled) return;
          
          clearTimeout(longPressTimer);
          this._buttons[buttonId].lastState = false;
          this._buttons[buttonId].currentState = false;
          
          // Only trigger press event if it wasn't a long press
          if (!this._buttons[buttonId].longPressTriggered && this._buttonPressCallback) {
            this._buttonPressCallback(buttonId);
          }
          
          // Remove the event listeners
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('mouseleave', handleMouseUp);
        };
        
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseleave', handleMouseUp);
      });
    }
  }
  
  setButtonPressCallback(callback) {
    this._buttonPressCallback = callback;
  }
  
  setButtonLongPressCallback(callback) {
    this._buttonLongPressCallback = callback;
  }
  
  update() {
    // The web simulator handles button events via DOM events
    // This method is kept for API compatibility but doesn't need to do anything
  }
  
  isButtonPressed(buttonId) {
    if (buttonId >= this._buttons.length) {
      return false;
    }
    
    return this._buttons[buttonId].currentState;
  }
  
  setButtonsEnabled(enabled) {
    this._buttonsEnabled = enabled;
  }
}

// UIManager and Screen classes
class UIManager {
  constructor(displayManager) {
    this._displayManager = displayManager;
    this._currentScreen = null;
    this._lastUpdateTime = 0;
  }
  
  begin() {
    Logger.begin("UI");
    Logger.info("Initializing UI manager...");
    
    this._currentScreen = null;
    
    Logger.info("UI manager initialized successfully");
    return true;
  }
  
  setScreen(screen) {
    if (this._currentScreen !== null) {
      Logger.debug("Deactivating screen");
      this._currentScreen.onDeactivate();
    }
    
    this._currentScreen = screen;
    
    if (this._currentScreen !== null) {
      Logger.debug("Activating new screen");
      this._currentScreen.onActivate();
    }
  }
  
  getCurrentScreen() {
    return this._currentScreen;
  }
  
  update() {
    const currentTime = Date.now();
    
    if (currentTime - this._lastUpdateTime >= CONFIG.UI_UPDATE_INTERVAL_MS) {
      this._lastUpdateTime = currentTime;
      
      if (this._currentScreen !== null) {
        this._currentScreen.update();
      }
    }
  }
  
  handleButtonPress(buttonId) {
    if (this._currentScreen !== null) {
      this._currentScreen.handleButtonPress(buttonId);
    }
  }
  
  handleButtonLongPress(buttonId) {
    if (this._currentScreen !== null) {
      this._currentScreen.handleButtonLongPress(buttonId);
    }
  }
}

class Screen {
  constructor(uiManager, displayManager) {
    this._uiManager = uiManager;
    this._displayManager = displayManager;
  }
  
  // Abstract methods to be implemented by subclasses
  onActivate() { throw new Error("onActivate must be implemented"); }
  onDeactivate() { throw new Error("onDeactivate must be implemented"); }
  update() { throw new Error("update must be implemented"); }
  handleButtonPress(buttonId) { throw new Error("handleButtonPress must be implemented"); }
  handleButtonLongPress(buttonId) { throw new Error("handleButtonLongPress must be implemented"); }
}

// Helper for Arduino millis() function
function millis() {
  return Date.now();
}

// Export for use in the main code
window.Logger = Logger;
window.DisplayManager = DisplayManager;
window.PowerManager = PowerManager;
window.InputManager = InputManager;
window.UIManager = UIManager;
window.Screen = Screen;
window.millis = millis;

// Button constants
window.BUTTON_UP = 0;
window.BUTTON_DOWN = 1;
window.BUTTON_SELECT = 2;

// Define TFT color constants globally
window.TFT_BLACK = TFT_BLACK;
window.TFT_WHITE = TFT_WHITE;
window.TFT_RED = TFT_RED;
window.TFT_GREEN = TFT_GREEN;
window.TFT_BLUE = TFT_BLUE;
window.TFT_YELLOW = TFT_YELLOW;
window.TFT_CYAN = TFT_CYAN;
