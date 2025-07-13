import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {RoomDataInterface} from '../interfaces/room-data.interface';
import {MovieTypeInterface} from '../interfaces/movie-type.interface';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private ratingApi: string = `${environment.apiUrl}/rating`;

  constructor(
    private httpClient: HttpClient,

  ) { }

  getRating(id: string)  {
    return this.httpClient.get(`${this.ratingApi}/id/${id}`);
  }

  findOnePersonOrMovieRating(id: string)  {
    return this.httpClient.get(`${this.ratingApi}/person-movie/id/${id}`);
  }
  calculatePersonOrMovieAverageRating(id: string)  {
    return this.httpClient.get(`${this.ratingApi}/calculate/id/${id}`);
  }
  addRating(movieOrCastId: string, body: {rating: string}) {
    return this.httpClient.patch(`${this.ratingApi}/rate/id/${movieOrCastId}`, body);
  }


}
