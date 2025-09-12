/**
 * 📝 Logger Utility
 * 
 * Centralized logging that can be easily disabled in production
 * Replace console.log with logger.log throughout the app
 */

const isDevelopment = import.meta.env.MODE === 'development'
const isDebugEnabled = import.meta.env.VITE_DEBUG === 'true'

class Logger {
  private enabled: boolean

  constructor() {
    // Enable logging only in development or when debug flag is set
    this.enabled = isDevelopment || isDebugEnabled
  }

  log(...args: any[]): void {
    if (this.enabled) {
      console.log(...args)
    }
  }

  error(...args: any[]): void {
    // Always log errors, even in production
    console.error(...args)
  }

  warn(...args: any[]): void {
    if (this.enabled) {
      console.warn(...args)
    }
  }

  info(...args: any[]): void {
    if (this.enabled) {
      console.info(...args)
    }
  }

  debug(...args: any[]): void {
    if (this.enabled) {
      console.debug(...args)
    }
  }

  group(label: string): void {
    if (this.enabled) {
      console.group(label)
    }
  }

  groupEnd(): void {
    if (this.enabled) {
      console.groupEnd()
    }
  }

  time(label: string): void {
    if (this.enabled) {
      console.time(label)
    }
  }

  timeEnd(label: string): void {
    if (this.enabled) {
      console.timeEnd(label)
    }
  }
}

// Export a singleton instance
export const logger = new Logger()

// Export as default for convenience
export default logger