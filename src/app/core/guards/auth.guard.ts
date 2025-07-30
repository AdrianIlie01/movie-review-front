import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services/auth.service';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    // in backend verificam daca userul are access_token - ok, daca nu => 401
    // daca are access_token -k -> return user info
   return this.authService.getUserInfo().pipe(
     map((isAuth: any) => {

       if (isAuth.authenticate) {
         return true;
       }
         if (isAuth && isAuth._2fa_required) {
           this.router.navigateByUrl('auth/login/verify-otp');
           return false;
         } else {
           this.router.navigateByUrl('auth/login');
           return false;
         }
       }
     )
   );

   }

}




// // import { Injectable } from '@angular/core';
// // import { CanActivate, Router } from '@angular/router';
// // import { AuthService } from '../services/auth.service';
// // import { Observable, of } from 'rxjs';
// // import { map, catchError, concatMap, tap } from 'rxjs/operators';
// //
// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthGuard implements CanActivate {
// //   constructor(private authService: AuthService, private router: Router) {}
// //
// //   // canActivate(): Observable<boolean> {
// //   //   return this.authService.checkRefreshToken().pipe(
// //   //
// //   //     concatMap((res: any) => {
// //   //       if (res.message === true) {
// //   //         console.log('avem refresh_token - ok ');
// //   //
// //   //         return this.authService.refreshToken().pipe(
// //   //
// //   //           map(() => {
// //   //             console.log('facem refrsh token')
// //   //           }),
// //   //
// //   //           concatMap(() => this.authService.isAuthenticated()),
// //   //
// //   //           map(isAuthenticatedRes => {
// //   //             if (isAuthenticatedRes) {
// //   //               console.log('Utilizator autentificat');
// //   //               return true;
// //   //             } else {
// //   //               throw new Error('User not authenticated');
// //   //             }
// //   //           })
// //   //
// //   //         );
// //   //       } else {
// //   //         throw new Error('Refresh token invalid');
// //   //       }
// //   //     }),
// //   //
// //   //     tap({
// //   //       error: () => {
// //   //         console.log('Redirecționare către login');
// //   //         this.router.navigateByUrl('auth/login');
// //   //       }
// //   //     }),
// //   //
// //   //     catchError(() => of(false))
// //   //   );
// //   // }
// //
// // }
//
//
// import { Injectable } from '@angular/core';
// import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
// import { AuthService } from '../services/auth.service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}
//   async canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ) {
//
//     const isAuth = await this.authService.isAuthenticated().toPromise();
//
//     console.log('isAuth');
//     console.log(isAuth);
//
//     if (isAuth) {
//       console.log('User is authenticated - guard');
//       // Dacă utilizatorul este autentificat, poate accesa ruta
//       return true;
//     } else {
//       console.log('User is not authenticated - guard');
//       // Dacă nu este autentificat, îl redirecționăm către pagina de login
//       this.router.navigateByUrl('auth/login');
//       return false;
//     }
//   } catch (error:any) {
//     console.error('Error during authentication check:', error);
//     this.router.navigateByUrl('auth/login');
//     return false;
//   }
//
// }
//
