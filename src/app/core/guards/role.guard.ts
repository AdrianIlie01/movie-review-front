import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    //aici doar luam datele userului din backend, nu verficam daca e logat
    // trb sa il folosim impreuna cu Auth Guard
    return this.authService.getUserInfo().pipe(
      map((user: any) => {
        const userRole = user?.roles; // Extragem rolul utilizatorului
        const allowedRoles = route.data['roles'] as string[]; // Rolurile permise pe rută
        if (allowedRoles.includes(userRole)) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
