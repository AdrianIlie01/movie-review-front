import {Component, OnInit} from '@angular/core';
import {PersonInterface} from '../../../../shared/interfaces/person.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {PersonService} from '../../services/person.service';
import {MoviePersonService} from '../../../movie-person/services/movie-person.service';
import {RoomService} from '../../../room/services/room.service';
import {RatingService} from '../../../../shared/services/rating.service';

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
  protected userRating: number | null = null;
  protected averageRating: number = 0;
  protected ratingCount: number = 0;
  protected personId!: string;
  // protected currentUserLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private movieService: RoomService,
    private castService: MoviePersonService,
    private ratingService: RatingService,
    // private authService: AuthService,
    // private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.personId = id;
      this.fetchPerson(id);

      this.ratingService.calculatePersonOrMovieAverageRating(this.personId).subscribe({
        next: (res: any) => {
          if (res && res.averageRating && res.ratingsCount) {
            this.averageRating = res.averageRating ?? 0;
            this.ratingCount = res.ratingsCount ?? 0;
          } else {
            this.averageRating = 0;
            this.ratingCount = 0;
          }
        }
      })
    }
  }

  fetchPerson(id: string): void {
    this.loading = true;
    this.personService.getPerson(id).subscribe({
      next: (data) => {
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

          console.log('Grouped Movies:', groupedMovies);
          this.moviesStarred = groupedMovies;

        });

      },
      error: (err) => {
        console.error('Error fetching person:', err);
        this.loading = false;
        this.error = true;
      }
    });

    // this.authService.isAuthenticated()
    //   .pipe(
    //     switchMap(isAuth => isAuth ? this.userService.getUserInfo() : of(null)))
    //   .subscribe((user: any)=> {
    //     this.currentUserLoaded = true;
    //     })

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

    this.router.navigate(['/movie', movie.id]);
  }

  loadRating() {
    this.ratingService.findOnePersonOrMovieRating(this.personId).subscribe({
      next: (res: any) => {
        if(res && res.rating && res.ratingsCount) {
          this.averageRating = res.rating ?? 0;
          this.ratingCount = res.ratingsCount ?? 0;
        } else {
          this.averageRating = 0;
          this.ratingCount = 0;
        }
      },
      error: (err) => {
        console.error('Error loading rating:', err);
      }
    });
  }
  ratePerson(value: number) {
    console.log('rate')
    console.log(this.person)
    if (!this.person) return;

    this.ratingService.addRating(this.person.id, { rating: value.toString() }).subscribe({
      next: (res: any) => {
        console.log('rated')
        this.averageRating = res.averageRating ?? this.averageRating;
        this.ratingCount = res.ratingsCount ?? this.ratingCount;

        this.userRating = null;
      },
      error: err => console.error(err)
    });
  }

}
