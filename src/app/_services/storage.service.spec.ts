import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    service.clean();
  });

  afterEach(() => {
    service.clean();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty object and not logged in when no user exists', () => {
    expect(service.getUser()).toEqual({});
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should persist and restore user from session storage', () => {
    const user = {
      id: 1,
      username: 'admin',
      roles: ['ROLE_USER', 'ROLE_ADMIN'],
    };

    service.saveUser(user);

    expect(service.isLoggedIn()).toBe(true);
    expect(service.getUser()).toEqual(user);
  });

  it('should overwrite existing user on subsequent saveUser calls', () => {
    service.saveUser({ username: 'first', roles: ['ROLE_USER'] });
    service.saveUser({ username: 'second', roles: ['ROLE_MODERATOR'] });

    expect(service.getUser()).toEqual({ username: 'second', roles: ['ROLE_MODERATOR'] });
  });

  it('should clear all session storage entries on clean', () => {
    window.sessionStorage.setItem('foo', 'bar');
    service.saveUser({ username: 'user', roles: ['ROLE_USER'] });

    service.clean();

    expect(window.sessionStorage.length).toBe(0);
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getUser()).toEqual({});
  });
});
