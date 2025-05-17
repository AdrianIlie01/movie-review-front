import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const modifiedReq = req.clone({
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      withCredentials: true // Adaugă automat cookie-ul HttpOnly
    });

    return next.handle(modifiedReq);
  }
}
