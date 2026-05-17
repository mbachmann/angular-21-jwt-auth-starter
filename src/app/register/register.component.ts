import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

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

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful.set(true);
        this.isSignUpFailed.set(false);
      },
      error: err => {
        this.errorMessage.set(err.error.message);
        this.isSignUpFailed.set(true);
      },
    });
  }
}
