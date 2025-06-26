import {CanActivate, Router} from '@angular/router';
import {catchError, filter, map, Observable, switchMap, take, throwError} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NonAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map(isAuth => {
        if (isAuth) {
          console.log('non auth guard - is auth')
          this.router.navigateByUrl('home').then();
          return false;
        } else {
          console.log('nu e auth - non-auth guard')
          return true;
        }
      })
    )
  }
}




// intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   // Asigură-te că la fiecare cerere sunt trimise cookie-urile
//   request = request.clone({withCredentials: true});
//
//   return next.handle(request).pipe(
//     catchError(error => {
//       if (error instanceof HttpErrorResponse && error.status === 401) {
//         console.log('er0are 401 facem handle401Error')
//         // Dacă primim un 401, încercăm reîmprospătarea token-ului
//         return this.handle401Error(request, next);
//       } else {
//         return throwError(error);
//       }
//     })
//   );
// }

// private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//   if (!this.isRefreshing) {
//     this.isRefreshing = true;
//
//     // Verifică dacă există refresh token
//     return this.authService.getRefreshToken().pipe(
//       switchMap((refreshToken: any) => {
//         if (refreshToken.message == false) {
//           console.log('!refreshToken');
//
//           // Dacă nu există refresh token, deconectează utilizatorul
//           this.authService.logout();
//           return throwError(() => new Error('No refresh token available - throw error daca refresh token nu exista din handle401'));
//         }
//
//         this.refreshTokenSubject.next(null);
//
//         return this.authService.refreshToken().pipe(
//           switchMap((token: any) => {
//             this.isRefreshing = false;
//             this.refreshTokenSubject.next(token);
//             // Reîncearcă cererea inițială cu noile credențiale
//             console.log('handle401Error: aici punem nou cookie ?');
//             return next.handle(request.clone({ withCredentials: true }));
//           }),
//           catchError(err => {
//             this.isRefreshing = false;
//             // Dacă reîmprospătarea token-ului eșuează, deconectăm utilizatorul
//             this.authService.logout();
//             return throwError(() => new Error('Refresh token failed'));
//           })
//         );
//       }),
//       catchError(err => {
//         this.isRefreshing = false;
//         // Dacă nu există refresh token sau apare orice altă eroare, deconectăm utilizatorul
//         this.authService.logout();
//         return throwError(err);
//       })
//     );
//   } else {
//     // Dacă există deja o cerere de reîmprospătare în curs, așteptăm finalizarea acesteia
//     return this.refreshTokenSubject.pipe(
//       filter(token => token != null),
//       take(1),
//       switchMap(token => {
//         console.log('daca deja este un request aici punem nou cookie ?');
//         return next.handle(request.clone({ withCredentials: true }));
//       })
//     );
//   }
// }
