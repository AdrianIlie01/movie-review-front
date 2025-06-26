import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserDataInterface} from '../../shared/interfaces/user-data.interface';
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {UserRegisterInterface} from '../../shared/interfaces/user-register.interface';
import {UserLoginInterface} from '../../shared/interfaces/user-login.interface';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {Router} from '@angular/router';
import {ResetForgottenPasswordInterface} from '../../shared/interfaces/reset-forgotten-password.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerApi: string = `${environment.apiUrl}/user/register`;
  private loginApi: string = `${environment.apiUrl}/auth/login/session`;
  private navigateToLogin = 'auth/login/session';
  private userApi: string = `${environment.apiUrl}/user`;
  // private authApi: string = `${environment.apiUrl}/auth`;
  private authApi: string = environment.apiUrl + '/auth';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  validateUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return new Observable<ValidationErrors | null>(observer => observer.next(null));
      }

      return this.checkUsernameAvailability(control.value).pipe(
        map((response: any) => {
          if (response.message === 'username taken') {
            return { usernameTaken: true };
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }

  validateUsernameLoggedIn(currentUsername: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const newUsername = control.value;

      if (!newUsername || newUsername === currentUsername) {
        return of(null); // Nu s-a schimbat, deci e valid
      }

      return this.checkUsernameAvailability(newUsername).pipe(
        map((response: any) => {
          return response.message === 'username taken' ? { usernameTaken: true } : null;
        }),
        catchError(() => of(null)) // Eroare de rețea, nu blocăm formularul
      );
    };
  }


  validateEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Dacă câmpul de email este gol, nu facem validare
      if (!control.value) {
        return new Observable<ValidationErrors | null>(observer => observer.next(null));
      }

      return this.checkEmailAvailability(control.value).pipe(
        map((response: any) => {
          if (response.message === 'email taken') {
            return { emailTaken: true };
          } else {
            return null;
          }
        }),
        catchError(() => of(null))
      );
    };
  }

  register(body: UserRegisterInterface) {
    return this.httpClient.post(this.registerApi, body, this.httpOptions );
  }

  login(body: UserLoginInterface) {
    return this.httpClient.post(this.loginApi, body, this.httpOptions);
  }



  logout() {
    return this.httpClient.post(this.authApi + '/logout/session', {});
  }

  refreshToken() {
    return this.httpClient.post(`${this.authApi}/refresh-token`, {}, { withCredentials: true });
  }

  checkRefreshToken() {
    return this.httpClient.post(`${this.authApi}/check-token`, {}, { withCredentials: true });
  }

  verify() {
    return this.httpClient.post(this.authApi + '/verify', {},
      // {
      //   withCredentials: true,  // Permite trimiterea și primirea cookie-urilor
      // }
    );
  }

  isAuthenticated() {
    return this.httpClient.get(this.authApi + '/is-authenticated');
  }

  generateOtp(id: string): Observable<any> {
    return this.httpClient.post(`${this.authApi}/generate-otp/${id}`, {});
  }

  // Apel pentru verificarea OTP
  verifyOtp(id: string, otp: string): Observable<any> {
    return this.httpClient.post(`${this.authApi}/otp-verify/${id}`, { otp });
  }

  getUserInfo() {
    return this.httpClient.get(this.userApi + '/get-user');
  }

  checkEmailAvailability(email: string){
    return this.httpClient.get(this.userApi + `/check-email-availability/${email}`);
  }

  checkUsernameAvailability(username: string){
    return this.httpClient.get(this.userApi + `/check-username-availability/${username}`);
  }

  private refreshInProgress = new BehaviorSubject<boolean>(false);
  private accessToken = '';

  refreshTokenIfNeeded(): Observable<boolean> {
    // Dacă refresh-ul este deja în curs, așteptăm să se termine
    if (this.refreshInProgress.value) {
      return new Observable(observer => observer.next(true));
    }

    // Dacă nu este în curs, începe reîmprospătarea token-ului
    this.refreshInProgress.next(true);

    return this.httpClient.post<any>(`${this.authApi}/refresh-token`, {}, { withCredentials: true }).pipe(
      tap((response) => {
        this.accessToken = response.access_token;
        this.refreshInProgress.next(false);
        return true;
      }),
      catchError((error) => {
        // this.router.navigate(['auth/login']);
        // this.router.navigate(['auth/login/session']);
        this.router.navigate([this.navigateToLogin]);
        this.refreshInProgress.next(false);
        return throwError(() => new Error('Refresh token failed'));
      })
    );
  }

  getAccessToken() {
    return this.accessToken;
  }

  sendUserIdentifier(body: { userIdentifier: string }) {
    return this.httpClient.post(this.userApi + '/send-otp-reset-password', body, this.httpOptions);

  }

  resetForgottenPassword(body: ResetForgottenPasswordInterface) {
    return this.httpClient.patch(this.userApi + '/reset-forgotten-password', body, this.httpOptions);
  }
}
