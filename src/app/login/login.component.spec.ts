import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { EventBusService } from '../_shared/event-bus.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const navigate = vi.fn().mockResolvedValue(true);
  const login = vi.fn();
  const saveUser = vi.fn();
  const emit = vi.fn();

  const storageServiceMock = {
    isLoggedIn: vi.fn().mockReturnValue(false),
    getUser: vi.fn().mockReturnValue({ roles: ['ROLE_USER'] }),
    saveUser,
  };

  const authServiceMock = {
    login,
  };

  const eventBusServiceMock = {
    emit,
  };

  const activatedRouteMock = {
    queryParamMap: of(convertToParamMap({ redirect: 'admin' })),
  };

  beforeEach(async () => {
    navigate.mockClear();
    login.mockReset();
    saveUser.mockClear();
    emit.mockClear();
    storageServiceMock.isLoggedIn.mockReturnValue(false);
    storageServiceMock.getUser.mockReturnValue({ roles: ['ROLE_USER'] });

    await TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: EventBusService, useValue: eventBusServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(navigate);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read redirect param when user is not logged in', () => {
    expect(component.redirectTo()).toBe('admin');
    expect(component.isLoggedIn()).toBe(false);
  });

  it('should initialize from storage when user is already logged in', async () => {
    storageServiceMock.isLoggedIn.mockReturnValue(true);
    storageServiceMock.getUser.mockReturnValue({ roles: ['ROLE_ADMIN'] });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isLoggedIn()).toBe(true);
    expect(component.roles()).toEqual(['ROLE_ADMIN']);
  });

  it('should login successfully, persist user, emit login event and navigate to redirect', async () => {
    login.mockReturnValue(of({ username: 'admin', roles: ['ROLE_ADMIN'] }));
    storageServiceMock.getUser.mockReturnValue({ roles: ['ROLE_ADMIN'] });
    component.form = { username: 'admin', password: 'secret' };

    await component.onSubmit();

    expect(login).toHaveBeenCalledWith('admin', 'secret');
    expect(saveUser).toHaveBeenCalledWith({ username: 'admin', roles: ['ROLE_ADMIN'] });
    expect(component.isLoginFailed()).toBe(false);
    expect(component.isLoggedIn()).toBe(true);
    expect(component.roles()).toEqual(['ROLE_ADMIN']);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(['/', 'admin']);
  });

  it('should set error message when login fails', async () => {
    login.mockReturnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    component.form = { username: 'admin', password: 'wrong' };

    await component.onSubmit();

    expect(component.isLoginFailed()).toBe(true);
    expect(component.errorMessage()).toBe('Invalid credentials');
    expect(navigate).not.toHaveBeenCalledWith(['/home']);
  });
});
