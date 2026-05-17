import { Component, OnInit, inject, signal } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
})
export class AppComponent implements OnInit {
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  private eventBusService = inject(EventBusService);
  private router = inject(Router);

  private roles = signal<string[]>([]);
  isLoggedIn = signal(false);
  showAdminBoard = signal(false);
  showModeratorBoard = signal(false);
  username = signal<string | undefined>(undefined);
  title = 'angular-21-jwt-auth';
  eventBusSub?: Subscription;

  ngOnInit(): void {
    this.init();

    this.eventBusSub = this.eventBusService.on('logout', () => {
      void this.logout();
    });

    this.eventBusService.on('login', (value: string) => {
      console.log('redirect', value);
      this.init();
    });
  }

  private init() {
    const loggedIn = this.storageService.isLoggedIn();
    this.isLoggedIn.set(loggedIn);

    if (loggedIn) {
      const user = this.storageService.getUser();
      this.roles.set(user.roles);
      this.showAdminBoard.set(this.roles().includes('ROLE_ADMIN'));
      this.showModeratorBoard.set(this.roles().includes('ROLE_MODERATOR'));
      this.username.set(user.username);
    } else {
      this.roles.set([]);
      this.showAdminBoard.set(false);
      this.showModeratorBoard.set(false);
      this.username.set(undefined);
    }
  }

  async logout(): Promise<void> {
    // Clear local session immediately so no further 401-triggered logout loops occur
    this.storageService.clean();
    this.init();
    await this.router.navigate(['/', 'home']);
    // Fire-and-forget: notify the backend; errors are silently ignored
    try {
      await firstValueFrom(this.authService.logout());
    } catch {
      // Backend logout errors are intentionally ignored because local logout already succeeded.
    }
  }
}
