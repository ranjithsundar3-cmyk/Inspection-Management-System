import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { AuthInterceptor } from './app/shared/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/shared/interceptors/error.interceptor';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor, ErrorInterceptor])
    ),
    provideAnimations()
  ]
}).catch(err => console.error(err));