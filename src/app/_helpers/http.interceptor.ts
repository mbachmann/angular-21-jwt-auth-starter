import { Injectable, inject } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { StorageService } from '../_services/storage.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private storageService = inject(StorageService);
  private eventBusService = inject(EventBusService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (!req.url.includes('auth/signin') && !req.url.includes('auth/signout') && error.status === 401) {
            return this.handle401Error();
          }
        } else if (error?.error?.message) {
          console.log(error?.error?.message);
        } else {
          switch (error.status) {
            case 0:
              console.log(`No connection to the backend.`);
              break;
            case 401:
              console.log(
                `The current session is not valid anymore. Please close the browser window and start the App again.`
              );
              break;
            case 404:
              console.log(`The object ${error.error?.message} has not been found or is inactive.`);
              break;
            default:
              console.log(error.message, error);
          }
        }

        return throwError(() => error);
      })
    );
  }

  /**
   * Emit a logout event so the app can clean up, then propagate the
   * original 401 error to the caller — WITHOUT retrying the request.
   * Uses isLoggedIn() as the single source of truth instead of a
   * never-resetting isRefreshing flag.
   */
  private handle401Error(): Observable<never> {
    if (this.storageService.isLoggedIn()) {
      // storageService.clean() is called synchronously inside AppComponent.logout(),
      // so a second 401 arriving right after will see isLoggedIn() === false.
      this.eventBusService.emit(new EventData('logout', null));
    }
    return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }));
  }
}

export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }];
