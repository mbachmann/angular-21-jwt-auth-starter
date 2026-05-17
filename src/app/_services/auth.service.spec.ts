import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { API_BASE_URL } from '../core/api-base-url.token';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageService: StorageService;
  const baseUrl = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        StorageService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService);
    storageService.clean();
  });

  afterEach(() => {
    httpMock.verify();
    storageService.clean();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST login credentials to signin endpoint', () => {
    const payload = { username: 'admin', password: 'secret' };
    let response: unknown;

    service.login(payload.username, payload.password).subscribe(data => {
      response = data;
    });

    const req = httpMock.expectOne(`${baseUrl}/api/auth/signin`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush({ jwtToken: 'token' });
    expect(response).toEqual({ jwtToken: 'token' });
  });

  it('should POST registration payload to signup endpoint', () => {
    const payload = { username: 'new-user', email: 'new@example.com', password: 'pw1234' };

    service.register(payload.username, payload.email, payload.password).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/auth/signup`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    req.flush({ message: 'ok' });
  });

  it('should POST empty payload to signout endpoint', () => {
    service.logout().subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/auth/signout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush({ message: 'signed out' });
  });

  it('should return false for hasAnyRole when user is not logged in', () => {
    expect(service.isLoggedIn()).toBe(false);
    expect(service.hasAnyRole(['ROLE_ADMIN'])).toBe(false);
  });

  it('should return true for hasAnyRole when one role matches', () => {
    storageService.saveUser({
      username: 'admin',
      roles: ['ROLE_USER', 'ROLE_ADMIN'],
    });

    expect(service.isLoggedIn()).toBe(true);
    expect(service.hasAnyRole(['ROLE_MODERATOR', 'ROLE_ADMIN'])).toBe(true);
    expect(service.findRole('ROLE_ADMIN')).toBe(true);
    expect(service.findRole('ROLE_MODERATOR')).toBe(false);
    expect(service.getRoles()).toEqual(['ROLE_USER', 'ROLE_ADMIN']);
  });
});
