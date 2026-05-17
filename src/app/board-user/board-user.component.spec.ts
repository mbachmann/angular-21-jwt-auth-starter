import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { BoardUserComponent } from './board-user.component';
import { UserService } from '../_services/user.service';

describe('BoardUserComponent', () => {
  let component: BoardUserComponent;
  let fixture: ComponentFixture<BoardUserComponent>;
  let getUserBoard: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getUserBoard = vi.fn().mockReturnValue(of('User Board Content.'));

    await TestBed.configureTestingModule({
      imports: [BoardUserComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserBoard,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardUserComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should display user board content from the service', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('p')?.textContent?.trim();

    expect(getUserBoard).toHaveBeenCalledTimes(1);
    expect(content).toBe('User Board Content.');
  });
});
