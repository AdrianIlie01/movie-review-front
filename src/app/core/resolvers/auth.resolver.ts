// import { Injectable } from '@angular/core';
// import { Resolve, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { catchError, switchMap } from 'rxjs/operators';
// import {AuthService} from '../services/auth.service';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthResolver implements Resolve<boolean> {
//   constructor(private authService: AuthService, private router: Router) {}
//
//   resolve(): Observable<boolean> {
//     return this.authService.refreshTokenIfNeeded().pipe(
//       switchMap(() => {
//         return [true];
//       }),
//       catchError((err) => {
//         this.router.navigate(['auth/login']);
//         return [false];
//       })
//     );
//   }
// }
