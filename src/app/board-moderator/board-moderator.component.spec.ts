import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { BoardModeratorComponent } from './board-moderator.component';
import { UserService } from '../_services/user.service';

describe('BoardModeratorComponent', () => {
  let component: BoardModeratorComponent;
  let fixture: ComponentFixture<BoardModeratorComponent>;
  let getModeratorBoard: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getModeratorBoard = vi.fn().mockReturnValue(of('Moderator Board Content.'));

    await TestBed.configureTestingModule({
      imports: [BoardModeratorComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            getModeratorBoard,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardModeratorComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should display moderator board content from the service', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('p')?.textContent?.trim();

    expect(getModeratorBoard).toHaveBeenCalledTimes(1);
    expect(content).toBe('Moderator Board Content.');
  });
});
