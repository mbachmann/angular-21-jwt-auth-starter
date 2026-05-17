import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'off';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  off: 50,
};

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private shouldLog(level: Exclude<LogLevel, 'off'>): boolean {
    const configured = this.getConfiguredLevel();
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[configured];
  }

  private getConfiguredLevel(): LogLevel {
    const level = environment.logging?.level as LogLevel | undefined;
    if (level && level in LOG_LEVEL_PRIORITY) {
      return level;
    }
    return 'off';
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(message, ...optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (this.shouldLog('info')) {
      console.info(message, ...optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(message, ...optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (this.shouldLog('error')) {
      console.error(message, ...optionalParams);
    }
  }
}

