// Main application code for the ESP32-S3 AI Smartwatch simulator

// Create instances of our manager classes
const displayManager = new DisplayManager();
const inputManager = new InputManager();
const powerManager = new PowerManager();
const uiManager = new UIManager(displayManager);

// Global variables
let clockScreen;
let menuScreen;
let simulatedTime = new Date();
let timeSpeedFactor = 1;

// Clock screen implementation
class ClockScreen extends Screen {
    constructor(uiManager, displayManager) {
        super(uiManager, displayManager);
        this._lastClockUpdate = 0;
    }
    
    onActivate() {
        this._displayManager.clear();
        this._displayManager.drawText("Clock Screen", 10, 10, TFT_WHITE, 2);
    }
    
    onDeactivate() {
        // Nothing to do here yet
    }
    
    update() {
        const now = Date.now();
        
        // Only update the clock display once per second
        if (now - this._lastClockUpdate >= 1000) {
            this._lastClockUpdate = now;
            
            // Get the current time
            const hour = simulatedTime.getHours();
            const minute = simulatedTime.getMinutes();
            const second = simulatedTime.getSeconds();
            
            // Clear the time area
            this._displayManager.getTFT()?.fillRect(40, 40, 160, 40, TFT_BLACK);
            
            // Draw the time
            this._displayManager.drawTime(50, 50, hour, minute, second, TFT_CYAN, 2);
            
            // Draw the date
            const day = simulatedTime.getDate();
            const month = simulatedTime.getMonth() + 1; // JavaScript months are 0-indexed
            const year = simulatedTime.getFullYear();
            this._displayManager.drawDate(70, 90, day, month, year, TFT_WHITE, 1);
            
            // Draw the battery status
            this._displayManager.drawBattery(190, 10, powerManager.getBatteryPercentage());
        }
    }
    
    handleButtonPress(buttonId) {
        if (buttonId === BUTTON_SELECT) {
            // Switch to menu screen
            this._uiManager.setScreen(menuScreen);
        }
    }
    
    handleButtonLongPress(buttonId) {
        // Not used in clock screen
    }
}

// Menu screen implementation
class MenuScreen extends Screen {
    constructor(uiManager, displayManager) {
        super(uiManager, displayManager);
        this._selectedItem = 0;
        this._menuItems = [
            "Settings",
            "Notifications",
            "Voice Assistant",
            "Back to Clock"
        ];
    }
    
    onActivate() {
        this._displayManager.clear();
        this._displayManager.drawText("Menu", 10, 10, TFT_WHITE, 2);
        this._drawMenuItems();
    }
    
    onDeactivate() {
        // Nothing to do here yet
    }
    
    update() {
        // Menu doesn't need constant updates
    }
    
    handleButtonPress(buttonId) {
        if (buttonId === BUTTON_UP) {
            if (this._selectedItem > 0) {
                this._selectedItem--;
                this._drawMenuItems();
            }
        }
        else if (buttonId === BUTTON_DOWN) {
            if (this._selectedItem < this._menuItems.length - 1) {
                this._selectedItem++;
                this._drawMenuItems();
            }
        }
        else if (buttonId === BUTTON_SELECT) {
            // Handle menu selection
            switch (this._selectedItem) {
                case 0: // Settings
                    Logger.info("Settings selected (not implemented)");
                    break;
                case 1: // Notifications
                    Logger.info("Notifications selected (not implemented)");
                    break;
                case 2: // Voice Assistant
                    Logger.info("Voice Assistant selected (not implemented)");
                    break;
                case 3: // Back to clock
                    this._uiManager.setScreen(clockScreen);
                    break;
            }
        }
    }
    
    handleButtonLongPress(buttonId) {
        if (buttonId === BUTTON_SELECT) {
            // Go back to clock screen on long press
            this._uiManager.setScreen(clockScreen);
        }
    }
    
    _drawMenuItems() {
        // Clear menu area
        this._displayManager.getTFT()?.fillRect(20, 40, 200, 100, TFT_BLACK);
        
        // Draw menu items
        for (let i = 0; i < this._menuItems.length; i++) {
            const color = (i === this._selectedItem) ? TFT_GREEN : TFT_WHITE;
            this._displayManager.drawText(this._menuItems[i], 20, 40 + i * 20, color, 1);
        }
    }
}

// Button callbacks
function handleButtonPress(buttonId) {
    // Reset inactivity timer when button is pressed
    powerManager.resetInactivityTimer();
    
    // Forward the button press to the current screen
    uiManager.handleButtonPress(buttonId);
}

function handleButtonLongPress(buttonId) {
    // Reset inactivity timer when button is long pressed
    powerManager.resetInactivityTimer();
    
    // Forward the button long press to the current screen
    uiManager.handleButtonLongPress(buttonId);
}

// Initialize the simulator
function initSimulator() {
    // Initialize serial communication for debugging (already handled by the Logger)
    console.log("ESP32-S3 AI Smartwatch Simulator starting...");
    
    // Initialize display
    if (!displayManager.begin()) {
        console.error("Failed to initialize display!");
        return;
    }
    
    // Display startup message
    displayManager.clear();
    displayManager.drawText("Starting...", 10, 10, TFT_WHITE, 2);
    
    // Initialize power management
    if (!powerManager.begin()) {
        console.warn("Warning: Power management initialization issues!");
    }
    
    // Set up auto sleep after 1 minute of inactivity
    powerManager.setAutoSleep(true, 60000);
    
    // Initialize input buttons
    inputManager.registerButton(BUTTON_UP, CONFIG.PIN_BUTTON_UP, true);
    inputManager.registerButton(BUTTON_DOWN, CONFIG.PIN_BUTTON_DOWN, true);
    inputManager.registerButton(BUTTON_SELECT, CONFIG.PIN_BUTTON_SELECT, true);
    
    // Set up button callbacks
    inputManager.setButtonPressCallback(handleButtonPress);
    inputManager.setButtonLongPressCallback(handleButtonLongPress);
    
    // Create screen objects
    clockScreen = new ClockScreen(uiManager, displayManager);
    menuScreen = new MenuScreen(uiManager, displayManager);
    
    // Initialize UI manager
    uiManager.begin();
    
    // Set the initial screen to clock
    uiManager.setScreen(clockScreen);
    
    // Set up time controls
    const timeSpeedSlider = document.getElementById('time-speed');
    if (timeSpeedSlider) {
        timeSpeedSlider.addEventListener('input', () => {
            timeSpeedFactor = parseInt(timeSpeedSlider.value);
            document.getElementById('time-speed-value').textContent = `${timeSpeedFactor}x`;
        });
    }
    
    // Set up simulator control buttons
    document.getElementById('btn-sleep')?.addEventListener('click', () => {
        powerManager.deepSleep(10000);
    });
    
    document.getElementById('btn-wake')?.addEventListener('click', () => {
        powerManager.resetInactivityTimer();
    });
    
    document.getElementById('btn-reset')?.addEventListener('click', () => {
        location.reload();
    });
    
    // Startup complete
    console.log("Initialization complete!");
}

// Main loop for the simulator
function simulatorLoop() {
    // Update the simulated time
    const now = Date.now();
    simulatedTime = new Date(simulatedTime.getTime() + (timeSpeedFactor * 16.67)); // Roughly 60 FPS
    
    // Update the current time display
    document.getElementById('current-time').textContent = 
        `${simulatedTime.getHours().toString().padStart(2, '0')}:${
        simulatedTime.getMinutes().toString().padStart(2, '0')}:${
        simulatedTime.getSeconds().toString().padStart(2, '0')}`;
    
    // Update the input manager to check for button presses
    inputManager.update();
    
    // Update the power manager
    powerManager.update();
    
    // Update the UI
    uiManager.update();
    
    // Continue the loop
    requestAnimationFrame(simulatorLoop);
}

// Start the simulator when the page loads
window.addEventListener('load', () => {
    initSimulator();
    simulatorLoop();
});