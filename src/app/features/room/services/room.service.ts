import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {UserDataInterface} from '../../../shared/interfaces/user-data.interface';
import {catchError, map, Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {MovieTypeInterface} from '../../../shared/interfaces/movie-type.interface';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomApi: string = `${environment.apiUrl}/room`;
  private videoRoomApi: string = `${environment.apiUrl}/video`;

  constructor(
    private httpClient: HttpClient,

  ) { }

  getVideo(name: string) {
    const encodedName = encodeURIComponent(name);

    return this.httpClient.get(`${this.roomApi}/get-video/${encodedName}`, {
      responseType: 'blob'
    });
  }

  getImage(name: string) {
   const encName = encodeURIComponent(name);
   return this.httpClient.get(this.roomApi + '/get-video/' + name, { responseType: 'blob' });
  }

  addMovie(body: {name: string, stream_url: string, type: MovieTypeInterface[], release_year: string}) {
    return this.httpClient.post(this.roomApi, body);
  }

  validateRoomName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const newUsername = control.value;

      return this.checkNameAvailability(newUsername).pipe(
        map((response: any) => {
          return response.message === 'name taken' ? { nameTaken: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  checkNameAvailability(name: string){
    console.log('check name');
    return this.httpClient.get(this.roomApi + `/check-name-availability/${name}`);
  }
  // addRoomVideo(id: string, file: File, roomName: any) {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('room_name', roomName);
  //
  //   // return this.httpClient.post<HttpEvent<any>>(this.videoRoomApi + '/' + id, formData, {
  //   //   reportProgress: true, // Permite progresul încărcării
  //   //   responseType: 'json',
  //   // });
  //   return this.httpClient.post(this.videoRoomApi + '/' + id, formData);
  // }
}
