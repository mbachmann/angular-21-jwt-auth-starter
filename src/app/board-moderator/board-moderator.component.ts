import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-board-moderator',
  templateUrl: './board-moderator.component.html',
  styleUrls: ['./board-moderator.component.css'],
  standalone: true,
})
export class BoardModeratorComponent implements OnInit {
  private userService = inject(UserService);

  content = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.userService.getModeratorBoard().subscribe({
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
