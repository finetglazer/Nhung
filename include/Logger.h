#ifndef LOGGER_H
#define LOGGER_H

#include <Arduino.h>

// Log levels
#define LOG_LEVEL_NONE    0
#define LOG_LEVEL_ERROR   1
#define LOG_LEVEL_WARNING 2
#define LOG_LEVEL_INFO    3
#define LOG_LEVEL_DEBUG   4
#define LOG_LEVEL_VERBOSE 5

// Set the default log level
#ifndef LOG_LEVEL
  #define LOG_LEVEL LOG_LEVEL_INFO
#endif

class Logger {
public:
    // Initialize the logger with a tag and optional log level
    static void begin(const char* tag, int level = LOG_LEVEL);
    
    // Log error messages
    static void error(const char* format, ...);
    
    // Log warning messages
    static void warning(const char* format, ...);
    
    // Log info messages
    static void info(const char* format, ...);
    
    // Log debug messages
    static void debug(const char* format, ...);
    
    // Log verbose messages
    static void verbose(const char* format, ...);
    
    // Set the log level at runtime
    static void setLogLevel(int level);
    
    // Get the current log level
    static int getLogLevel();
    
private:
    static char _tag[16];
    static int _logLevel;
    
    // Internal log function
    static void _log(int level, const char* levelStr, const char* format, va_list args);
};

// Convenience macros for logging
#define LOG_E(...) Logger::error(__VA_ARGS__)
#define LOG_W(...) Logger::warning(__VA_ARGS__)
#define LOG_I(...) Logger::info(__VA_ARGS__)
#define LOG_D(...) Logger::debug(__VA_ARGS__)
#define LOG_V(...) Logger::verbose(__VA_ARGS__)

#endif // LOGGER_H