import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
})
export class HomeComponent implements OnInit {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  content?: string;

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
        this.cdr.detectChanges();
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message + ' (Backend running?)';
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}` + ' (Backend running?)';
          }
        } else {
          this.content = `Error with status: ${err.status}` + ' (Backend running?)';
        }
        this.cdr.detectChanges();
      },
    });
  }
}
