import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { httpInterceptorProviders } from './app/_helpers/http.interceptor';
import { API_BASE_URL } from './app/core/api-base-url.token';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(AppRoutingModule),
    httpInterceptorProviders,
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: API_BASE_URL,
      useValue: environment.API_BASE_PATH,
    },
  ],
}).catch(err => console.error(err));
