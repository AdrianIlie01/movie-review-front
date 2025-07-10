import {Component, OnInit} from '@angular/core';
import {PersonInterface} from '../../../../shared/interfaces/person.interface';
import {ButtonName} from '../../../../shared/enums/button-name';
import {Router} from '@angular/router';
import {PersonService} from '../../services/person.service';
import {environment} from '../../../../../environments/environment';
import {MoviePersonService} from '../../../movie-person/services/movie-person.service';

@Component({
  selector: 'app-person-list',
  standalone: false,

  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent implements OnInit{
  protected people: PersonInterface[] = [];
  protected loading = false;
  protected readonly ButtonName = ButtonName;
  protected errorDataBase: boolean = false;

  constructor(
    protected router: Router,
    protected personService: PersonService,
    protected castService: MoviePersonService,
  ) {}
  private personApi: string = `${environment.apiUrl}/person`;

  ngOnInit() {
    this.loading = true;

    this.personService.getAllPersons().subscribe({
      next: (data: PersonInterface[]) => {
        this.people = data;
        this.loading = false;
        this.errorDataBase = false;


      },
      error: (err) => {
        this.loading = false;
        this.errorDataBase = true;
      }
    });
  }

  get showPeople(): boolean {
    return (this.people?.length ?? 0) > 0 && !this.errorDataBase;
  }


  displayMovies(personId: any){
    this.router.navigateByUrl(`/credits/filmography/${personId}`);
  }

  editPerson(id: string) {
    this.router.navigateByUrl(`/person/edit/${id}`);
  }

  getRoleList(roles: string[]): string {
    return roles.map(role => this.toTitleCase(role)).join(', ');
  }

  toTitleCase(str: string): string {
    return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }


  getPersonImage(person: PersonInterface) {
    if (person.images && person.images.length > 0) {
      return this.personService.getImage(person.images[0]);
    } else {
      return this.personService.getDefaultImage('default_person.jpg');
    }
  }

  getPersonMovies(person: any) {
    const movies = person.movieRoles.map((data: any) => {
      return data.room.name
    })

    return movies;
  }

  onImageError(event: Event, video: any) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.personService.getDefaultImage('default_person.jpg');

  }
}
