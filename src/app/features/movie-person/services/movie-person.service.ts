import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {
  AddRolesPersonForSingleMovieInterface
} from '../../../shared/interfaces/add-roles-person-for-single-movie.interface';
import {
  AddPersonsSingleRoleToMovieInterface
} from '../../../shared/interfaces/add-persons-single-role-to-movie.interface';
import {PersonRoles} from '../../../shared/enums/person-roles';
import {AddRolesForMovieInterface} from '../../../shared/interfaces/add-roles-for-movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MoviePersonService {

  private api: string = `${environment.apiUrl}/movie-person`;

  // private httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   }),
  //   withCredentials: true
  // };
  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getAll() {
    return this.httpClient.get(this.api);
  }
  managePersonRolesPerMovie(roomId: string, role: PersonRoles, body: AddPersonsSingleRoleToMovieInterface) {
    return this.httpClient.post(`${this.api}/movie/${roomId}/${role}`, body);
  }
  managePersonPerRolePerMovie(personId: string, movieId: string, body: AddRolesPersonForSingleMovieInterface) {
    return this.httpClient.post(`${this.api}/person-roles/${movieId}/${personId}`, body);
  }

  managePersonMoviesPerRole(personId: string, role: PersonRoles, body: AddRolesPersonForSingleMovieInterface) {
    return this.httpClient.post(`${this.api}/person/${personId}/${role}`, body);
  }

  addPersonsToRoleInMovie(roomId: string, body: AddPersonsSingleRoleToMovieInterface) {
    return this.httpClient.post(`${this.api}/add-cast/movie/${roomId}`, body);
  }

  addPersonRolesToMovie(personId:string, body: AddRolesForMovieInterface) {
    return this.httpClient.post(`${this.api}/add-roles/person/${personId}`, body);
  }

  getMovieCast(movieId: string) {
    return this.httpClient.get(`${this.api}/cast/movie/${movieId}`);
  }

  getMoviesByPersonRole(personId: string, role: PersonRoles) {
    return this.httpClient.get(`${this.api}/movie/${personId}/${role}`);
  }

  getMovieCastByRole(movieId: string, role: PersonRoles) {
    return this.httpClient.get(`${this.api}/cast/movie/${movieId}/${role}`);
  }

  getMoviesForPerson(personId: string) {
    return this.httpClient.get(`${this.api}/${personId}/movies`);
  }

}
