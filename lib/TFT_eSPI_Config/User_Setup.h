// Configuration file for TFT_eSPI library with Adafruit Feather ESP32-S3 TFT
// Place this file in a directory named "TFT_eSPI_Config" in your lib folder

#define USER_SETUP_INFO "User_Setup for Adafruit Feather ESP32-S3 TFT"

// Define the board as ESP32
#define ESP32_PARALLEL

// TFT display width and height
#define TFT_WIDTH  240
#define TFT_HEIGHT 135

// Color depth options
#define COLOR_DEPTH 16

// Define the pins used for the TFT interface on the Adafruit Feather ESP32-S3 TFT
#define TFT_CS   42  // Chip select control pin
#define TFT_DC   40  // Data Command control pin
#define TFT_RST  41  // Reset pin
#define TFT_BL   45  // LED back-light control pin

// Hardware SPI pins for Feather ESP32-S3
#define TFT_MOSI 35  // SPI MOSI pin
#define TFT_SCLK 36  // SPI Clock pin
#define TFT_MISO 37  // SPI MISO pin

// Use hardware SPI
#define USE_HSPI_PORT

// Touch screen settings - if your screen has touch capability
#define TOUCH_CS 39   // Touch screen chip select
#define TOUCH_IRQ 38  // Touch screen interrupt pin

// Font setup
#define LOAD_GLCD   // Font 1. Original Adafruit 8 pixel font needs ~1820 bytes in FLASH
#define LOAD_FONT2  // Font 2. Small 16 pixel high font, needs ~3534 bytes in FLASH, 96 characters
#define LOAD_FONT4  // Font 4. Medium 26 pixel high font, needs ~5848 bytes in FLASH, 96 characters
#define LOAD_FONT6  // Font 6. Large 48 pixel font, needs ~2666 bytes in FLASH, only characters 1234567890:-.apm
#define LOAD_FONT7  // Font 7. 7 segment 48 pixel font, needs ~2438 bytes in FLASH, only characters 1234567890:.
#define LOAD_FONT8  // Font 8. Large 75 pixel font needs ~3256 bytes in FLASH, only characters 1234567890:-.

// Smooth font support
#define SMOOTH_FONT

// SPI frequency
#define SPI_FREQUENCY  27000000

// Don't use DMA by default (can be enabled for faster display updates)
// #define DMA_ENABLE