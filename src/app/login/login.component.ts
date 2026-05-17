import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { EventData } from '../_shared/event.class';
import { EventBusService } from '../_shared/event-bus.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, NgClass],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private eventBusService = inject(EventBusService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  form: any = {
    username: null,
    password: null,
  };
  isLoggedIn = signal(false);
  isLoginFailed = signal(false);
  errorMessage = signal('');
  roles = signal<string[]>([]);
  redirectTo = signal<string | null>(null);

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn.set(true);
      this.roles.set(this.storageService.getUser().roles);
    } else {
      this.activatedRoute.queryParamMap.subscribe(params => {
        this.redirectTo.set(params.get('redirect'));
      });
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);

        this.isLoginFailed.set(false);
        this.isLoggedIn.set(true);
        this.roles.set(this.storageService.getUser().roles);
        this.eventBusService.emit(new EventData('login', this.redirectTo()));

        // Navigate automatically after successful login
        const redirect = this.redirectTo();
        if (redirect) {
          this.router.navigate(['/', redirect]);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: err => {
        this.errorMessage.set(err.error?.message ?? 'Login failed');
        this.isLoginFailed.set(true);
      },
    });
  }

  navigateTo() {
    this.router.navigate(['/', this.redirectTo()]);
  }
}
