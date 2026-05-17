import { Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../_services/user.service';
import { getHttpErrorMessage } from '../core/_shared/http-error-message.util';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css'],
  standalone: true,
})
export class BoardUserComponent implements OnInit {
  private userService = inject(UserService);

  content = signal<string | undefined>(undefined);

  ngOnInit(): void {
    void this.loadContent();
  }

  private async loadContent(): Promise<void> {
    try {
      const data = await firstValueFrom(this.userService.getUserBoard());
      this.content.set(data);
    } catch (err: any) {
      this.content.set(getHttpErrorMessage(err));
    }
  }
}
