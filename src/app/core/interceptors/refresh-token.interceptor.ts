import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //copiem requestul initial indiferent daca da eroare sau nu
    const clonedRequest = req.clone();

    return next.handle(clonedRequest).pipe(

      // daca da eroare requestul initial
      catchError((error: HttpErrorResponse) => {

        // Verificăm dacă are eroare 401 Unauthorized
        if (error.status === 401) {

          // 401 => facem refresh la token
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // refresh-ul ok - atunci apelam din nou cererea ce dadu-se ianinte eroare de 401
              return next.handle(clonedRequest);
            }),

            catchError(() => {
              // daca refresh_token esueaza il redirectionam spre login - nu mai ajunge in guard cloneRequest (next.handle(clonedRequest)) ca sa ne redirectioneze el
              // in backend refresh token esueaza cu 400 l-am pus in backend sa nu fie 401 - ca ar fi infinit loop de mai sus
              this.router.navigate(['auth/login']);
              return throwError(() => error);
            })
          );
        }

        // Daca cloneRequest nu are eroare de 401, propagăm eroarea
        return throwError(() => error);
      })
    );
  }
}
