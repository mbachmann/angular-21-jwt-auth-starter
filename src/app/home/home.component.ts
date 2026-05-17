import { Component, OnInit, inject, signal } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);

  content = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content.set(data);
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content.set(res.message + ' (Backend running?)');
          } catch {
            this.content.set(`Error with status: ${err.status} - ${err.statusText}` + ' (Backend running?)');
          }
        } else {
          this.content.set(`Error with status: ${err.status}` + ' (Backend running?)');
        }
      },
    });
  }
}
