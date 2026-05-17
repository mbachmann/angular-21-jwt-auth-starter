import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { RegisterComponent } from './register.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const register = vi.fn();
  const authServiceMock = { register };

  beforeEach(async () => {
    register.mockReset();

    await TestBed.configureTestingModule({
      imports: [FormsModule, RegisterComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set success flags when registration succeeds', async () => {
    register.mockReturnValue(of({ message: 'ok' }));
    component.form = { username: 'new-user', email: 'new@example.com', password: 'pw1234' };

    await component.onSubmit();

    expect(register).toHaveBeenCalledWith('new-user', 'new@example.com', 'pw1234');
    expect(component.isSuccessful()).toBe(true);
    expect(component.isSignUpFailed()).toBe(false);
  });

  it('should set error message and failure flag when registration fails', async () => {
    register.mockReturnValue(throwError(() => ({ error: { message: 'Email already taken' } })));
    component.form = { username: 'new-user', email: 'new@example.com', password: 'pw1234' };

    await component.onSubmit();

    expect(component.isSuccessful()).toBe(false);
    expect(component.isSignUpFailed()).toBe(true);
    expect(component.errorMessage()).toBe('Email already taken');
  });
});
