import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { firstValueFrom, of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { HttpRequestInterceptor } from './http.interceptor';
import { StorageService } from '../_services/storage.service';
import { EventBusService } from '../_shared/event-bus.service';

describe('HttpRequestInterceptor', () => {
  let interceptor: HttpRequestInterceptor;
  const isLoggedIn = vi.fn();
  const emit = vi.fn();

  const storageServiceMock = {
    isLoggedIn,
  };

  const eventBusServiceMock = {
    emit,
  };

  beforeEach(() => {
    isLoggedIn.mockReset();
    emit.mockReset();

    TestBed.configureTestingModule({
      providers: [
        HttpRequestInterceptor,
        { provide: StorageService, useValue: storageServiceMock },
        { provide: EventBusService, useValue: eventBusServiceMock },
      ],
    });

    interceptor = TestBed.inject(HttpRequestInterceptor);
  });

  it('should forward request with credentials enabled', async () => {
    const handle = vi.fn().mockReturnValue(of(new HttpResponse({ status: 200, body: 'ok' })));
    const next = { handle } as HttpHandler;
    const request = new HttpRequest('GET', '/api/test/all');

    await firstValueFrom(interceptor.intercept(request, next));

    expect(handle).toHaveBeenCalledTimes(1);
    const forwarded = handle.mock.calls[0][0] as HttpRequest<unknown>;
    expect(forwarded.withCredentials).toBe(true);
  });

  it('should emit logout event and return unauthorized error on protected 401 when logged in', async () => {
    isLoggedIn.mockReturnValue(true);
    const next = {
      handle: vi.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }))),
    } as HttpHandler;
    const request = new HttpRequest('GET', '/api/test/user');

    await expect(firstValueFrom(interceptor.intercept(request, next))).rejects.toMatchObject({
      status: 401,
      statusText: 'Unauthorized',
    });

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ name: 'logout', value: null }));
  });

  it('should not emit logout for /auth/signin 401 errors', async () => {
    isLoggedIn.mockReturnValue(true);
    const originalError = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    const next = {
      handle: vi.fn().mockReturnValue(throwError(() => originalError)),
    } as HttpHandler;
    const request = new HttpRequest('POST', '/api/auth/signin', {});

    await expect(firstValueFrom(interceptor.intercept(request, next))).rejects.toBe(originalError);
    expect(emit).not.toHaveBeenCalled();
  });

  it('should not emit logout on protected 401 when not logged in', async () => {
    isLoggedIn.mockReturnValue(false);
    const next = {
      handle: vi.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }))),
    } as HttpHandler;
    const request = new HttpRequest('GET', '/api/test/admin');

    await expect(firstValueFrom(interceptor.intercept(request, next))).rejects.toMatchObject({
      status: 401,
      statusText: 'Unauthorized',
    });
    expect(emit).not.toHaveBeenCalled();
  });
});


