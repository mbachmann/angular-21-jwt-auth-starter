import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { UserService } from './user.service';
import { API_BASE_URL } from '../core/api-base-url.token';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: baseUrl },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET public content from /api/test/all', () => {
    let response = '';

    service.getPublicContent().subscribe(data => {
      response = data;
    });

    const req = httpMock.expectOne(`${baseUrl}/api/test/all`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');

    req.flush('Public Content.');
    expect(response).toBe('Public Content.');
  });

  it('should GET user board content from /api/test/user', () => {
    let response = '';

    service.getUserBoard().subscribe(data => {
      response = data;
    });

    const req = httpMock.expectOne(`${baseUrl}/api/test/user`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');

    req.flush('User Content.');
    expect(response).toBe('User Content.');
  });

  it('should GET moderator board content from /api/test/mod', () => {
    let response = '';

    service.getModeratorBoard().subscribe(data => {
      response = data;
    });

    const req = httpMock.expectOne(`${baseUrl}/api/test/mod`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');

    req.flush('Moderator Content.');
    expect(response).toBe('Moderator Content.');
  });

  it('should GET admin board content from /api/test/admin', () => {
    let response = '';

    service.getAdminBoard().subscribe(data => {
      response = data;
    });

    const req = httpMock.expectOne(`${baseUrl}/api/test/admin`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');

    req.flush('Admin Content.');
    expect(response).toBe('Admin Content.');
  });
});
