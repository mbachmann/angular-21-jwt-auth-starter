import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { vi } from 'vitest';

import { authGuard } from './auth-guard';
import { AuthService } from '../_services/auth.service';
import { LoggerService } from '../core/_shared/logger.service';

describe('roleGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  const hasAnyRole = vi.fn();
  const isLoggedIn = vi.fn();
  const authServiceMock = {
    hasAnyRole,
    isLoggedIn,
  };
  const warn = vi.fn();
  const loggerServiceMock = {
    warn,
  };
  const navigate = vi.fn().mockResolvedValue(true);

  const createRoute = (roles: string[], path = 'admin') =>
    ({
      data: { roles },
      routeConfig: { path },
    }) as unknown as ActivatedRouteSnapshot;

  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    hasAnyRole.mockReset();
    isLoggedIn.mockReset();
    navigate.mockClear();
    warn.mockClear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
      ],
    });

    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(navigate);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation when user has required role', () => {
    hasAnyRole.mockReturnValue(true);

    const result = executeGuard(createRoute(['ROLE_ADMIN']), state);

    expect(result).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
  });

  it('should redirect to /401 when logged in but role is missing', () => {
    hasAnyRole.mockReturnValue(false);
    isLoggedIn.mockReturnValue(true);

    const result = executeGuard(createRoute(['ROLE_ADMIN'], 'admin'), state);

    expect(result).toBe(false);
    expect(warn).toHaveBeenCalledWith('No access rights, required roles:', ['ROLE_ADMIN']);
    expect(navigate).toHaveBeenCalledWith(['/', '401'], { queryParams: { redirect: 'admin' } });
  });

  it('should redirect to /login when user is not logged in', () => {
    hasAnyRole.mockReturnValue(false);
    isLoggedIn.mockReturnValue(false);

    const result = executeGuard(createRoute(['ROLE_ADMIN'], 'admin'), state);

    expect(result).toBe(false);
    expect(warn).toHaveBeenCalledWith('No access rights, required roles:', ['ROLE_ADMIN']);
    expect(navigate).toHaveBeenCalledWith(['/', 'login'], { queryParams: { redirect: 'admin' } });
  });
});
