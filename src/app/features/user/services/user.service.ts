import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';
import {UserInterface} from '../../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  protected apiUrl = environment.apiUrl + '/user';
  protected userInfoUrl = environment.apiUrl + '/user-info';
  constructor(
    protected httpClient: HttpClient
  ) { }

  getAllUsers(): Observable<UserInterface[]>  {
    return this.httpClient.get<UserInterface[]>(this.apiUrl);
  }

  getUserInfo() {
    return this.httpClient.get(this.apiUrl + '/get-user');
  }

  editUser(body: any, id: string) {
    const url = this.apiUrl + '/' + id;
    console.log('body')
    console.log(body)
    return this.httpClient.patch(url, body);
  }

  changeRole(body: {role: string }, id:string) {
    return this.httpClient.patch(`${this.apiUrl}/change-role/${id}`, body);
  }

  banUser(id:string) {
    return this.httpClient.patch(`${this.apiUrl}/ban-user/${id}`, {});
  }

  unBanUser(id:string) {
    return this.httpClient.patch(`${this.apiUrl}/unban-user/${id}`, {});
  }


  deleteUser(id: string) {
    return this.httpClient.delete(this.apiUrl + '/' + id);
  }

  addUserInfo(body: any, id: string) {
   return this.httpClient.post(`${this.userInfoUrl}/${id}`, body)
  }

  getInfoOfUser(id: string) {
    console.log(`${this.userInfoUrl}/user/${id}`);
    return this.httpClient.get(`${this.userInfoUrl}/user/${id}`);
  }

  sendOtpResetEmail(id: string) {
    return this.httpClient.post(`${this.apiUrl}/send-otp-change-email/${id}`, {});
  }

  changeEmail(body: any, id: string) {
    return this.httpClient.patch(`${this.apiUrl}/change-email/${id}`, body);
  }

  changePassword(body: any, id: string) {
    return this.httpClient.patch(`${this.apiUrl}/update-pass-log/${id}`, body);
  }

  editUserInfo(body: any, id: string) {
    return this.httpClient.patch(`${this.userInfoUrl}/${id}`, body)
  }

  enableDisable2Fa(id: string) {
    return this.httpClient.post(`${this.apiUrl}/enableDisable2fa/${id}`, {})
  }
 regionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return new Observable<ValidationErrors | null>(observer => observer.next(null));
    }
    const allowedRegions = ['eu', 'as', 'na', 'sa'];
    return allowedRegions.includes(control.value) ? null : { invalidRegion: true };
  };
};

}

