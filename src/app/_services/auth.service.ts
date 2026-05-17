import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { API_BASE_URL } from '../core/api-base-url.token';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private readonly AUTH_API = inject(API_BASE_URL) + '/api/auth/';

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      this.AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      this.AUTH_API + 'signup',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(this.AUTH_API + 'signout', {}, httpOptions);
  }

  hasAnyRole(allowedRoles: string[]): boolean {
    let hasRole = false;
    hasRole = allowedRoles.some(r => this.findRole(r));
    return hasRole;
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  findRole(role: string): boolean {
    if (this.isLoggedIn()) {
      if (this.getRoles()) {
        return this.getRoles().some(r => r === role);
      }
    }
    return false;
  }

  getRoles(): string[] {
    const user = this.storageService.getUser();
    return user.roles;
  }
}
