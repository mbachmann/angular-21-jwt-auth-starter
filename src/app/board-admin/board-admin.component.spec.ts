import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { BoardAdminComponent } from './board-admin.component';
import { UserService } from '../_services/user.service';

describe('BoardAdminComponent', () => {
  let component: BoardAdminComponent;
  let fixture: ComponentFixture<BoardAdminComponent>;
  let getAdminBoard: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    getAdminBoard = vi.fn().mockReturnValue(of('Admin Board Content.'));

    await TestBed.configureTestingModule({
      imports: [BoardAdminComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            getAdminBoard,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardAdminComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should display admin board content from the service', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('p')?.textContent?.trim();

    expect(getAdminBoard).toHaveBeenCalledTimes(1);
    expect(content).toBe('Admin Board Content.');
  });
});
