#include "Logger.h"

// Static member initialization
char Logger::_tag[16] = "APP";
int Logger::_logLevel = LOG_LEVEL;

void Logger::begin(const char* tag, int level) {
    // Copy tag name (with truncation if needed)
    strncpy(_tag, tag, sizeof(_tag) - 1);
    _tag[sizeof(_tag) - 1] = '\0';
    
    // Set log level
    _logLevel = level;
    
    // Initialize Serial if not already done
    if (!Serial) {
        Serial.begin(115200);
        delay(10); // Give Serial time to initialize
    }
}

void Logger::error(const char* format, ...) {
    if (_logLevel >= LOG_LEVEL_ERROR) {
        va_list args;
        va_start(args, format);
        _log(LOG_LEVEL_ERROR, "E", format, args);
        va_end(args);
    }
}

void Logger::warning(const char* format, ...) {
    if (_logLevel >= LOG_LEVEL_WARNING) {
        va_list args;
        va_start(args, format);
        _log(LOG_LEVEL_WARNING, "W", format, args);
        va_end(args);
    }
}

void Logger::info(const char* format, ...) {
    if (_logLevel >= LOG_LEVEL_INFO) {
        va_list args;
        va_start(args, format);
        _log(LOG_LEVEL_INFO, "I", format, args);
        va_end(args);
    }
}

void Logger::debug(const char* format, ...) {
    if (_logLevel >= LOG_LEVEL_DEBUG) {
        va_list args;
        va_start(args, format);
        _log(LOG_LEVEL_DEBUG, "D", format, args);
        va_end(args);
    }
}

void Logger::verbose(const char* format, ...) {
    if (_logLevel >= LOG_LEVEL_VERBOSE) {
        va_list args;
        va_start(args, format);
        _log(LOG_LEVEL_VERBOSE, "V", format, args);
        va_end(args);
    }
}

void Logger::setLogLevel(int level) {
    _logLevel = level;
}

int Logger::getLogLevel() {
    return _logLevel;
}

void Logger::_log(int level, const char* levelStr, const char* format, va_list args) {
    // Print timestamp
    unsigned long ms = millis();
    unsigned long seconds = ms / 1000;
    unsigned long minutes = seconds / 60;
    unsigned long hours = minutes / 60;
    
    // Format: [HH:MM:SS.mmm][TAG][LEVEL] message
    Serial.printf("[%02lu:%02lu:%02lu.%03lu][%s][%s] ", 
        hours % 24, minutes % 60, seconds % 60, ms % 1000, 
        _tag, levelStr);
    
    // Print the actual message
    char buf[256];
    vsnprintf(buf, sizeof(buf), format, args);
    Serial.println(buf);
}
