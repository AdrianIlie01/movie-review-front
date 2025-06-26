import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private roomApi: string = `${environment.apiUrl}/room`;

  constructor(
    private httpClient: HttpClient,

  ) { }

  getVideo(name: string) {
    const encodedName = encodeURIComponent(name);

    return this.httpClient.get(`${this.roomApi}/get-video/${encodedName}`, {
      responseType: 'blob'
    });
  }
}
