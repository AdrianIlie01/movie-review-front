import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {UserDataInterface} from '../../../shared/interfaces/user-data.interface';
import {catchError} from 'rxjs';
import {environment} from '../../../../environments/environment';

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

  addRoomVideo(id: string, file: File, roomName: any) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('room_name', roomName);

    console.log('service roomName');
    console.log(formData.get('room_name'));

    // return this.httpClient.post<HttpEvent<any>>(this.videoRoomApi + '/' + id, formData, {
    //   reportProgress: true, // Permite progresul încărcării
    //   responseType: 'json',
    // });
    return this.httpClient.post(this.videoRoomApi + '/' + id, formData);
  }
}
