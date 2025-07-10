import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MoviePersonService} from '../../services/movie-person.service';
import {PersonRoles} from '../../../../shared/enums/person-roles';
import {ButtonName} from '../../../../shared/enums/button-name';
import {AddRolesForMovieComponent} from '../add-roles-for-movie/add-roles-for-movie.component';

@Component({
  selector: 'app-display-person-filmography',
  standalone: false,

  templateUrl: './display-person-filmography.component.html',
  styleUrl: './display-person-filmography.component.css'
})
export class DisplayPersonFilmographyComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private castService: MoviePersonService
  ) {
  }

  protected personId!: string;
  protected movies: any[] = [];
  protected groupedMovies: Partial<Record<PersonRoles, any[]>> = {};
  protected groupedMovieKeys: PersonRoles[] = [];
  protected readonly ButtonName = ButtonName;
  protected personName!: string;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.personId = params['personId'];

      this.castService.getMoviesForPerson(this.personId).subscribe((data: any) => {
        this.movies = data;
        console.log('data')
        console.log(data)

        if (data && data[0]) {
          this.personName = data[0].person.name
        }

        this.groupMoviesByRole();
      });
    });
  }

  groupMoviesByRole() {
    const grouped = this.movies.reduce((acc, curr) => {
      const role = curr.person_role as PersonRoles;
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role]!.push(curr);
      return acc;
    }, {} as Partial<Record<PersonRoles, any[]>>);

    this.groupedMovies = {} as Partial<Record<PersonRoles, any[]>>;
    for (const role of Object.values(PersonRoles)) {
      this.groupedMovies[role] = grouped[role] ?? [];
    }

    this.groupedMovieKeys = Object.keys(grouped) as PersonRoles[];
  }

  manageMovies(role: PersonRoles)  {
    console.log(`credits/manage-movies/${this.personId}/${role}`)
    this.router.navigateByUrl(`credits/manage-movies/${this.personId}/${role}`);
  }


  addRolesPerMovie() {
    console.log('dispaly personId')
    console.log(this.personId)
      this.router.navigateByUrl(`credits/add-roles/${this.personId}`);
  }

  redirectMovie(movie: any) {
    console.log('movie')
    console.log(movie)
    console.log(movie.id)
    this.router.navigateByUrl(`room/edit/${movie.room.id}`);
  }

}
