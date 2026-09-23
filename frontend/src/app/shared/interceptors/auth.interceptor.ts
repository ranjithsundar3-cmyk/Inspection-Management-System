import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const isApiUrl = req.url.startsWith(environment.baseUrl);

    if (token && isApiUrl) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}