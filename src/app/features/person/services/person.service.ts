import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MovieTypeInterface} from '../../../shared/interfaces/movie-type.interface';
import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {catchError, map, Observable, of} from 'rxjs';
import {PersonInterface} from '../../../shared/interfaces/person.interface';
import {UserInterface} from '../../../shared/interfaces/user.interface';
import {FilterCast} from '../../../shared/interfaces/filter-cast.interface';

@Injectable({
  providedIn: 'root'
})

export class PersonService {

  private personApi: string = `${environment.apiUrl}/person`;

  constructor(
    private httpClient: HttpClient,
  ) { }

  getAllPersons() {
    return this.httpClient.get<PersonInterface[]>(`${this.personApi}`);
  }
  getAllPaginated(limit: number, offset: number): Observable<PersonInterface[]> {
    return this.httpClient.get<PersonInterface[]>(`${this.personApi}/paginated?limit=${limit}&offset=${offset}`);
  }

  getPerson(id: string) {
    return this.httpClient.get<PersonInterface>(`${this.personApi}/id/${id}`);
  }

  addPerson(body: PersonInterface) {
    return this.httpClient.post(this.personApi, body);
  }

  updatePerson(body: PersonInterface, id: string) {
    return this.httpClient.patch(`${this.personApi}/id/${id}`, body);
  }
  validatePersonName(): AsyncValidatorFn {
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

  validateEditPersonName(id: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const newUsername = control.value;

      return this.checkEditNameAvailability(newUsername, id).pipe(
        map((response: any) => {
          return response.message === 'name taken' ? { nameTaken: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  validDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) return null; // e opțional => valid

      const dateValue = new Date(value);
      const now = new Date();

      if (isNaN(dateValue.getTime())) {
        return { invalidDate: true }; // Nu e dată validă
      }

      if (dateValue > now) {
        return { futureDate: true }; // Data e în viitor
      }

      if (dateValue.getFullYear() < 1900) {
        return { tooOld: true }; // Data e prea veche
      }

      return null;
    };
  }

  checkNameAvailability(name: string){
    return this.httpClient.get(this.personApi + `/check-name-availability/${name}`);
  }

  checkEditNameAvailability(name: string, id: string){
    return this.httpClient.get(this.personApi + `/check-name-edit-availability/${name}/${id}`);
  }
  getDefaultImage(filename: string) {
    // return this.httpClient.get(`${this.personApi}/default-person-image/${filename}`);
    return `${this.personApi}/default-person-image/${filename}`;
  }

  getImagesNamePerson(id: string) {
    return this.httpClient.get(`${this.personApi}/images-name/${id}`);
  }

  getImage(filename: string) {
    // return this.httpClient.get(`${this.personApi}/images/file/${filename}`);
    return `${this.personApi}/images/file/${filename}`;

  }

  filterCast(query: FilterCast) {
    let params = new HttpParams();

    for (const key in query) {
      const typedKey = key as keyof FilterCast;
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

    return this.httpClient.get(`${this.personApi}/filter`, { params });
  }
}
