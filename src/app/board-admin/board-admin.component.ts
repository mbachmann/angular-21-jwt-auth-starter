import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css'],
  standalone: true,
})
export class BoardAdminComponent implements OnInit {
  private userService = inject(UserService);

  content = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe({
      next: data => {
        this.content.set(data);
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content.set(res.message);
          } catch {
            this.content.set(`Error with status: ${err.status} - ${err.statusText}`);
          }
        } else {
          this.content.set(`Error with status: ${err.status}`);
        }
      },
    });
  }
}
