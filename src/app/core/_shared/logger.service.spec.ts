import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { LoggerService } from './logger.service';
import { environment } from '../../../environments/environment';

describe('LoggerService', () => {
  let service: LoggerService;
  const originalLevel = environment.logging.level;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  afterEach(() => {
    environment.logging.level = originalLevel;
    vi.restoreAllMocks();
  });

  it('should log all levels when level is debug', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    environment.logging.level = 'debug';
    service.debug('debug');
    service.info('info');
    service.warn('warn');
    service.error('error');

    expect(debugSpy).toHaveBeenCalledWith('debug');
    expect(infoSpy).toHaveBeenCalledWith('info');
    expect(warnSpy).toHaveBeenCalledWith('warn');
    expect(errorSpy).toHaveBeenCalledWith('error');
  });

  it('should suppress debug when level is info', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    environment.logging.level = 'info';
    service.debug('debug');
    service.info('info');
    service.warn('warn');
    service.error('error');

    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalledWith('info');
    expect(warnSpy).toHaveBeenCalledWith('warn');
    expect(errorSpy).toHaveBeenCalledWith('error');
  });

  it('should log only warn and error when level is warn', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    environment.logging.level = 'warn';
    service.debug('debug');
    service.info('info');
    service.warn('warn');
    service.error('error');

    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith('warn');
    expect(errorSpy).toHaveBeenCalledWith('error');
  });

  it('should log only error when level is error', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    environment.logging.level = 'error';
    service.debug('debug');
    service.info('info');
    service.warn('warn');
    service.error('error');

    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('error');
  });

  it('should disable all logs when level is off', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    environment.logging.level = 'off';
    service.debug('debug');
    service.info('info');
    service.warn('warn');
    service.error('error');

    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
  });
});

