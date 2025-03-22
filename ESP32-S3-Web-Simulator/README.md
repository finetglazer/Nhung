# ESP32-S3 AI Smartwatch Web Simulator

This web simulator allows you to test your ESP32-S3 AI Smartwatch code in a browser before deploying it to actual hardware. It simulates the display, buttons, battery, and other key components of your smartwatch.

## Folder Structure

```
ESP32-S3-Web-Simulator/
├── index.html                  # Main simulator interface
├── esp32-adapters.js           # JavaScript adapters for ESP32 C++ classes
├── simulator-app.js            # Main application logic (similar to main.cpp)
├── hello-world-test.html       # Simple test interface
├── hello-world-test.js         # Simple display test (similar to hello_world_test.cpp)
└── README.md                   # This file
```

## How to Run the Simulator

1. **Setup a local web server**:
   - The easiest way is to use VS Code with the "Live Server" extension
   - Or use Python's built-in HTTP server: 
     ```
     python -m http.server
     ```
   - Or use Node.js's http-server:
     ```
     npx http-server
     ```

2. **Navigate to the simulator**:
   - Open your browser and go to:
     - For Live Server in VS Code: http://localhost:5500/
     - For Python's server: http://localhost:8000/
     - For http-server: http://localhost:8080/

3. **Using the simulator**:
   - The main page (index.html) shows the full simulator with all controls
   - The hello-world-test.html page is a simplified test of the display

## Features

- **Display Simulation**: See how your UI will appear on the actual device
- **Button Controls**: Test button interactions (up, down, select)
- **Battery Simulation**: Control battery level to test power management
- **Time Simulation**: Adjust time speed to test time-dependent features
- **Logging System**: See detailed logs from your application

## How to Adapt Your Code

1. The simulator uses JavaScript versions of your C++ classes with the same method signatures
2. To test your ESP32 code with the simulator:
   - Create new JavaScript files similar to simulator-app.js and hello-world-test.js
   - Use the JavaScript adapters provided in esp32-adapters.js
   - Reference your new files in the HTML files

## Integrating with PlatformIO Project

The simulator runs independently from your PlatformIO project but mirrors its structure. When developing:

1. Make changes to your C++ code in PlatformIO
2. Create equivalent JavaScript versions for testing in the simulator
3. Verify functionality in the simulator
4. Deploy the C++ code to the actual hardware

This approach allows you to develop more confidently and reduce debugging time on the physical hardware.
