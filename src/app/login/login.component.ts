import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { EventData } from '../_shared/event.class';
import { EventBusService } from '../_shared/event-bus.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { getHttpErrorMessage } from '../core/_shared/http-error-message.util';

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
    void this.initState();
  }

  private async initState(): Promise<void> {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn.set(true);
      this.roles.set(this.storageService.getUser().roles);
    } else {
      const params = await firstValueFrom(this.activatedRoute.queryParamMap);
      this.redirectTo.set(params.get('redirect'));
    }
  }

  async onSubmit(): Promise<void> {
    const { username, password } = this.form;

    try {
      const data = await firstValueFrom(this.authService.login(username, password));
      this.storageService.saveUser(data);

      this.isLoginFailed.set(false);
      this.isLoggedIn.set(true);
      this.roles.set(this.storageService.getUser().roles);
      this.eventBusService.emit(new EventData('login', this.redirectTo()));

      // Navigate automatically after successful login
      const redirect = this.redirectTo();
      if (redirect) {
        await this.router.navigate(['/', redirect]);
      } else {
        await this.router.navigate(['/home']);
      }
    } catch (err: any) {
      const message = typeof err?.error?.message === 'string' ? err.error.message : getHttpErrorMessage(err);
      this.errorMessage.set(message || 'Login failed');
      this.isLoginFailed.set(true);
    }
  }

  async navigateTo(): Promise<void> {
    await this.router.navigate(['/', this.redirectTo()]);
  }
}
