import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ProfileComponent } from './profile.component';
import { StorageService } from '../_services/storage.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const getUser = vi.fn();

  const storageServiceMock = {
    getUser,
  };

  beforeEach(async () => {
    getUser.mockReset();
    getUser.mockReturnValue({ username: 'admin', email: 'admin@example.com', roles: ['ROLE_USER', 'ROLE_ADMIN'] });

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [{ provide: StorageService, useValue: storageServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user from storage on init', () => {
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(component.currentUser).toEqual({
      username: 'admin',
      email: 'admin@example.com',
      roles: ['ROLE_USER', 'ROLE_ADMIN'],
    });
  });

  it('should render username, email and roles for logged-in user', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('admin');
    expect(text).toContain('admin@example.com');

    const roleItems = fixture.nativeElement.querySelectorAll('li');
    expect(roleItems.length).toBe(2);
  });

  it('should show login hint when no current user is available', async () => {
    getUser.mockReturnValue(null);

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Please login.');
  });
});
