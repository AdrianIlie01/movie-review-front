import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  protected apiUrl = environment.apiUrl + '/user';
  protected userInfoUrl = environment.apiUrl + '/user-info';
  constructor(
    protected httpClient: HttpClient
  ) { }

  getUserInfo() {
    return this.httpClient.get(this.apiUrl + '/get-user');
  }

  editUser(body: any, id: string) {
    console.log('service');

    const url = this.apiUrl + '/' + id;
    return this.httpClient.patch(url, body);
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

  editUserInfo(body: any, id: string) {
    console.log('body');
    console.log(body);
    console.log(`${this.userInfoUrl}/${id}`)

    return this.httpClient.patch(`${this.userInfoUrl}/${id}`, body)
  }

 regionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const allowedRegions = ['eu', 'as', 'na', 'sa'];
    return allowedRegions.includes(control.value) ? null : { invalidRegion: true };
  };
};

}

