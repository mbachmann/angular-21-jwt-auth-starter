import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { getHttpErrorMessage } from '../core/_shared/http-error-message.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, NgClass],
})
export class RegisterComponent {
  private authService = inject(AuthService);

  form: any = {
    username: null,
    email: null,
    password: null,
  };
  isSuccessful = signal(false);
  isSignUpFailed = signal(false);
  errorMessage = signal('');

  async onSubmit(): Promise<void> {
    const { username, email, password } = this.form;

    try {
      await firstValueFrom(this.authService.register(username, email, password));
      this.isSuccessful.set(true);
      this.isSignUpFailed.set(false);
    } catch (err: any) {
      const message = typeof err?.error?.message === 'string' ? err.error.message : getHttpErrorMessage(err);
      this.errorMessage.set(message || 'Signup failed');
      this.isSignUpFailed.set(true);
    }
  }
}
