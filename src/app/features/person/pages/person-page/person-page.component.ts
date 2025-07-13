import {Component, OnInit} from '@angular/core';
import {PersonInterface} from '../../../../shared/interfaces/person.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonService} from '../../services/person.service';
import {MoviePersonService} from '../../../movie-person/services/movie-person.service';
import {RoomService} from '../../../room/services/room.service';

@Component({
  selector: 'app-person-page',
  standalone: false,

  templateUrl: './person-page.component.html',
  styleUrl: './person-page.component.css'
})
export class PersonPageComponent implements OnInit {
  protected person: PersonInterface | null = null;
  protected loading = false;
  protected error = false;
  protected defaultImage: boolean = false;
  protected moviesStarred: Record<string, { id: string; name: string }[]> = {};

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private movieService: RoomService,
    private castService: MoviePersonService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchPerson(id);
    }
  }

  fetchPerson(id: string): void {
    this.loading = true;
    this.personService.getPerson(id).subscribe({
      next: (data) => {
        console.log('data')
        console.log(data)
        this.person = data;
        this.loading = false;
        if (data.images == null) {
          this.defaultImage = true;
        }

        this.castService.getMoviesForPerson(data.id).subscribe((movies: any) => {
          const groupedMovies: Record<string, { id: string; name: string }[]> = {};

          movies.forEach((m: any) => {
            const role = m.person_role;

            const movieData = {
              id: m.room.id,
              name: m.room.name
            };

            if (!groupedMovies[role]) {
              groupedMovies[role] = [];
            }

            groupedMovies[role].push(movieData);
          });

          this.moviesStarred = groupedMovies;

          console.log('Grouped movies:', this.moviesStarred);
        });

      },
      error: (err) => {
        console.error('Error fetching person:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  getRoleList(roles: string[]): string {
    return roles.map(role => role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ');
  }

  getDefaultImage(): string {
    return this.personService.getDefaultImage('default_person.jpg');
  }

  currentImageIndex = 0;

  getPersonImageByIndex(index: number): string {
    if (this.person?.images && this.person.images.length === 1) {
      return this.personService.getImage(this.person.images[0]);
    } else if (this.person?.images && this.person.images[index]) {
      return this.personService.getImage(this.person.images[index]);
    }
    // return this.personService.getDefaultImage('default_person.jpg');

    if (this.person?.images == null || this.person.images.length === 0) {
      return this.personService.getDefaultImage('default_person.jpg');
    }

    return this.personService.getDefaultImage('default_person.jpg');
  }

  nextImage(): void {
    if (!this.person?.images) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.person.images.length;
  }

  prevImage(): void {
    if (!this.person?.images) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.person.images.length) % this.person.images.length;
  }

  redirectMovie(movie: any){
    console.log('movie yo')
    console.log(movie.id)

    this.router.navigate(['/movie', movie.id]);
  }

}
