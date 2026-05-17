import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../_services/user.service';

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
    this.userService.getUserBoard().subscribe({
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
