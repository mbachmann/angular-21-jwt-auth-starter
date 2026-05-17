import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { HomeComponent } from './home.component';
import { UserService } from '../_services/user.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let getPublicContent: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getPublicContent = vi.fn().mockReturnValue(of('Public Content.'));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            getPublicContent,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should display public content from the service', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('p')?.textContent?.trim();

    expect(getPublicContent).toHaveBeenCalledTimes(1);
    expect(content).toBe('Public Content.');
  });
});
