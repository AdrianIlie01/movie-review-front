import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams} from '@angular/common/http';
import {UserDataInterface} from '../../../shared/interfaces/user-data.interface';
import {catchError, map, Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {MovieTypeInterface} from '../../../shared/interfaces/movie-type.interface';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {RoomDataInterface} from '../../../shared/interfaces/room-data.interface';
import {PersonInterface} from '../../../shared/interfaces/person.interface';
import {FilterMovie} from '../../../shared/interfaces/filter-movie.interface';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomApi: string = `${environment.apiUrl}/room`;
  private videoRoomApi: string = `${environment.apiUrl}/video`;

  constructor(
    private httpClient: HttpClient,

  ) { }

  getAllRooms(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.roomApi}`);
  }

  getAllPaginated(limit: number, offset: number): Observable<RoomDataInterface[]> {
    return this.httpClient.get<RoomDataInterface[]>(`${this.roomApi}/paginated?limit=${limit}&offset=${offset}`);
  }

  getRoom(id: string)  {
    return this.httpClient.get<RoomDataInterface>(`${this.roomApi}/id/${id}`);
  }

  //default thumbnail based on theme

// room.service.ts
  getDefaultThumbnail(filename: string): string {
    return `${this.roomApi}/default-theme-thumbnail/${filename}`;
  }

  getThumbnailUrl(filename: string): string {
    return `${this.roomApi}/thumbnail/${filename}`;
  }

  updateRoom(body: {name: string, stream_url: string, type: MovieTypeInterface[], release_year: string}, id: string) {
    return this.httpClient.patch(`${this.roomApi}/id/${id}`, body);
  }

  // getDefaultThumbnail(name: string) {
  //   console.log('default thumbnail')
  //   return this.httpClient.get(`${this.roomApi}/default-theme-thumbnail/${name}`);
  // }
  //
  // getThumbnail(name: string) {
  //   console.log('get thumbnail')
  //   return this.httpClient.get(`${this.roomApi}/thumbnail/${name}`);
  // }

  // getThumbnailUrl(thumbnail: string | null, isVideo: boolean) {
  //   if (thumbnail === null && isVideo) {
  //     return this.defaultThumbnail = `${environment.urlBackend}/video/default-video-thumbnail`;
  //   }
  //   if (thumbnail === null && !isVideo) {
  //     return this.defaultThumbnail = `${environment.urlBackend}/video/default-thumbnail`;
  //   }
  //   if (thumbnail !== null && isVideo) {
  //     return `${environment.urlBackend}/video/thumbnail/${thumbnail}`;
  //   }
  //   if (thumbnail !== null && !isVideo) {
  //     return `${environment.urlBackend}/video/thumbnail/${thumbnail}`;
  //   }
  //   else {
  //     return this.defaultThumbnail = ''
  //   }
  // }


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

  addMovie(body: PersonInterface) {
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
    return this.httpClient.get(this.roomApi + `/check-name-availability/${name}`);
  }

  validateRoomNameEdit(id: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const newUsername = control.value;

      return this.checkNameEditAvailability(newUsername, id).pipe(
        map((response: any) => {
          console.log('async validator response:', response);
          return response.message === 'name taken' ? { nameTaken: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  checkNameEditAvailability(name: string, id: string){
    return this.httpClient.get(this.roomApi + `/check-name-edit-availability/${name}/${id}`);
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

  filterMovie(query: FilterMovie) {
    let params = new HttpParams();

    for (const key in query) {
      const typedKey = key as keyof FilterMovie;
      const value = query[typedKey];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => {
            params = params.append(key, v.toString());
          });
        } else {
          // set query params to our HttpParams
          params = params.set(key, value.toString());
        }
      }
    }

    return this.httpClient.get(`${this.roomApi}/filter`, { params });
  }

}
