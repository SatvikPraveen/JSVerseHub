// src/utils/logger.js - Logging Utility

/**
 * JSVLogger - Advanced logging utility for JSVerseHub
 * Provides structured logging with levels, formatting, and persistence
 */

class JSVLogger {
  constructor() {
    this.logLevel = this.getLogLevel();
    this.maxLogEntries = 1000;
    this.logs = [];
    this.listeners = [];
    this.isInitialized = false;

    // Log levels with priorities
    this.levels = {
      DEBUG: { priority: 0, color: "#6c757d", emoji: "🔍" },
      INFO: { priority: 1, color: "#17a2b8", emoji: "📘" },
      SUCCESS: { priority: 2, color: "#28a745", emoji: "✅" },
      WARN: { priority: 3, color: "#ffc107", emoji: "⚠️" },
      ERROR: { priority: 4, color: "#dc3545", emoji: "❌" },
      CRITICAL: { priority: 5, color: "#6f42c1", emoji: "🚨" },
    };

    this.init();
  }

  /**
   * Initialize logger
   */
  init() {
    this.setupConsoleInterception();
    this.loadStoredLogs();
    this.isInitialized = true;
    this.info("🚀 JSVLogger initialized");
  }

  /**
   * Get current log level from localStorage or default
   */
  getLogLevel() {
    const stored = localStorage.getItem("jsversehub-log-level");
    return stored || (this.isProduction() ? "WARN" : "DEBUG");
  }

  /**
   * Set log level
   */
  setLogLevel(level) {
    if (!this.levels[level]) {
      this.warn(`Invalid log level: ${level}`);
      return false;
    }

    this.logLevel = level;
    localStorage.setItem("jsversehub-log-level", level);
    this.info(`Log level set to: ${level}`);
    return true;
  }

  /**
   * Check if we're in production mode
   */
  isProduction() {
    return (
      window.location.protocol === "https:" &&
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1")
    );
  }

  /**
   * Main logging method
   */
  log(level, message, ...args) {
    const levelConfig = this.levels[level];
    if (!levelConfig) {
      console.error("Invalid log level:", level);
      return;
    }

    // Check if log level meets minimum threshold
    if (levelConfig.priority < this.levels[this.logLevel].priority) {
      return;
    }

    const timestamp = new Date();
    const logEntry = {
      id: this.generateLogId(),
      timestamp,
      level,
      message,
      args,
      stack:
        level === "ERROR" || level === "CRITICAL" ? this.getStackTrace() : null,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Add to internal log storage
    this.addLogEntry(logEntry);

    // Output to console with styling
    this.outputToConsole(logEntry);

    // Notify listeners
    this.notifyListeners(logEntry);

    // Store critical logs
    if (levelConfig.priority >= this.levels.ERROR.priority) {
      this.persistLog(logEntry);
    }
  }

  /**
   * Debug level logging
   */
  debug(message, ...args) {
    this.log("DEBUG", message, ...args);
  }

  /**
   * Info level logging
   */
  info(message, ...args) {
    this.log("INFO", message, ...args);
  }

  /**
   * Success level logging
   */
  success(message, ...args) {
    this.log("SUCCESS", message, ...args);
  }

  /**
   * Warning level logging
   */
  warn(message, ...args) {
    this.log("WARN", message, ...args);
  }

  /**
   * Error level logging
   */
  error(message, ...args) {
    this.log("ERROR", message, ...args);
  }

  /**
   * Critical level logging
   */
  critical(message, ...args) {
    this.log("CRITICAL", message, ...args);
  }

  /**
   * Add log entry to internal storage
   */
  addLogEntry(logEntry) {
    this.logs.unshift(logEntry);

    // Maintain max log entries
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(0, this.maxLogEntries);
    }
  }

  /**
   * Output log entry to console with formatting
   */
  outputToConsole(logEntry) {
    const { timestamp, level, message, args } = logEntry;
    const levelConfig = this.levels[level];

    const timeStr = timestamp.toISOString().split("T")[1].slice(0, 8);
    const prefix = `[${timeStr}] ${levelConfig.emoji} ${level}:`;

    const style = `
            color: ${levelConfig.color};
            font-weight: ${
              level === "ERROR" || level === "CRITICAL" ? "bold" : "normal"
            };
        `;

    if (args.length > 0) {
      console.groupCollapsed(`%c${prefix} ${message}`, style);
      args.forEach((arg, index) => {
        console.log(`Arg ${index + 1}:`, arg);
      });
      if (logEntry.stack) {
        console.log("Stack trace:", logEntry.stack);
      }
      console.groupEnd();
    } else {
      console.log(`%c${prefix} ${message}`, style);
    }
  }

  /**
   * Generate unique log ID
   */
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get stack trace for errors
   */
  getStackTrace() {
    try {
      throw new Error();
    } catch (e) {
      return e.stack;
    }
  }

  /**
   * Setup console interception for unhandled errors
   */
  setupConsoleInterception() {
    // Intercept unhandled errors
    window.addEventListener("error", (event) => {
      this.error("Unhandled error:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // Intercept unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.error("Unhandled promise rejection:", event.reason);
    });

    // Override console methods to capture all logs
    const originalMethods = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console),
    };

    console.log = (...args) => {
      originalMethods.log(...args);
      if (args[0] && !args[0].toString().includes("JSVLogger")) {
        this.debug("Console.log:", ...args);
      }
    };

    console.warn = (...args) => {
      originalMethods.warn(...args);
      if (args[0] && !args[0].toString().includes("JSVLogger")) {
        this.warn("Console.warn:", ...args);
      }
    };

    console.error = (...args) => {
      originalMethods.error(...args);
      if (args[0] && !args[0].toString().includes("JSVLogger")) {
        this.error("Console.error:", ...args);
      }
    };
  }

  /**
   * Persist important logs to localStorage
   */
  persistLog(logEntry) {
    try {
      const storedLogs = JSON.parse(
        localStorage.getItem("jsversehub-error-logs") || "[]"
      );
      storedLogs.unshift({
        ...logEntry,
        args: this.serializeArgs(logEntry.args),
      });

      // Keep only last 50 error logs
      const trimmedLogs = storedLogs.slice(0, 50);
      localStorage.setItem(
        "jsversehub-error-logs",
        JSON.stringify(trimmedLogs)
      );
    } catch (error) {
      // Ignore localStorage errors
    }
  }

  /**
   * Load stored logs from localStorage
   */
  loadStoredLogs() {
    try {
      const storedLogs = JSON.parse(
        localStorage.getItem("jsversehub-error-logs") || "[]"
      );
      this.info(`Loaded ${storedLogs.length} stored error logs`);
    } catch (error) {
      this.warn("Failed to load stored logs:", error);
    }
  }

  /**
   * Serialize arguments for storage
   */
  serializeArgs(args) {
    return args.map((arg) => {
      try {
        if (typeof arg === "object" && arg !== null) {
          return JSON.stringify(arg, null, 2);
        }
        return String(arg);
      } catch (error) {
        return "[Unserializable Object]";
      }
    });
  }

  /**
   * Get all logs with optional filtering
   */
  getLogs(filter = {}) {
    let filteredLogs = [...this.logs];

    if (filter.level) {
      filteredLogs = filteredLogs.filter((log) => log.level === filter.level);
    }

    if (filter.since) {
      const since = new Date(filter.since);
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= since);
    }

    if (filter.message) {
      const searchTerm = filter.message.toLowerCase();
      filteredLogs = filteredLogs.filter((log) =>
        log.message.toLowerCase().includes(searchTerm)
      );
    }

    if (filter.limit) {
      filteredLogs = filteredLogs.slice(0, filter.limit);
    }

    return filteredLogs;
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = [];
    localStorage.removeItem("jsversehub-error-logs");
    this.info("All logs cleared");
  }

  /**
   * Export logs as JSON
   */
  exportLogs(filename = null) {
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        totalLogs: this.logs.length,
        logLevel: this.logLevel,
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      logs: this.logs,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      filename ||
      `jsversehub-logs-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.info("Logs exported to file");
  }

  /**
   * Create performance timer
   */
  time(label) {
    const startTime = performance.now();
    return {
      end: () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        this.debug(`Timer "${label}": ${duration.toFixed(2)}ms`);
        return duration;
      },
    };
  }

  /**
   * Log group operations
   */
  group(label, collapsed = false) {
    if (collapsed) {
      console.groupCollapsed(label);
    } else {
      console.group(label);
    }
    this.debug(`Group started: ${label}`);
  }

  /**
   * End log group
   */
  groupEnd() {
    console.groupEnd();
    this.debug("Group ended");
  }

  /**
   * Log table data
   */
  table(data, columns = null) {
    console.table(data, columns);
    this.debug("Table logged", { data, columns });
  }

  /**
   * Add listener for log events
   */
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Notify listeners of new log entries
   */
  notifyListeners(logEntry) {
    this.listeners.forEach((callback) => {
      try {
        callback(logEntry);
      } catch (error) {
        // Avoid infinite loop
        console.error("Logger listener error:", error);
      }
    });
  }

  /**
   * Get logger statistics
   */
  getStats() {
    const stats = {
      totalLogs: this.logs.length,
      logLevel: this.logLevel,
      levelCounts: {},
    };

    // Count logs by level
    Object.keys(this.levels).forEach((level) => {
      stats.levelCounts[level] = this.logs.filter(
        (log) => log.level === level
      ).length;
    });

    return stats;
  }

  /**
   * Create a child logger with prefix
   */
  createChild(prefix) {
    const childLogger = Object.create(this);
    const originalLog = this.log.bind(this);

    childLogger.log = (level, message, ...args) => {
      originalLog(level, `[${prefix}] ${message}`, ...args);
    };

    return childLogger;
  }

  /**
   * Enable or disable logging
   */
  setEnabled(enabled) {
    if (enabled) {
      this.setLogLevel("DEBUG");
    } else {
      this.setLogLevel("CRITICAL");
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!JSVLogger.instance) {
      JSVLogger.instance = new JSVLogger();
    }
    return JSVLogger.instance;
  }
}

// Create singleton instance
const JSVLogger = JSVLogger.getInstance();

// Export for use in other modules
if (typeof window !== "undefined") {
  window.JSVLogger = JSVLogger;
}
