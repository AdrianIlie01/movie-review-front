import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RoomService} from '../../../room/services/room.service';
import {PersonService} from '../../../person/services/person.service';
import {map} from 'rxjs/operators';
import {RoomDataInterface} from '../../../../shared/interfaces/room-data.interface';
import {MovieTypes} from '../../../../shared/enums/movie-types';
import {PersonRoles} from '../../../../shared/enums/person-roles';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  homeSearchParams!: {
    name: string;
    category: 'movie' | 'cast';
    filterValue: any;
    sortField: string;
    sortOrder: 'ASC' | 'DESC';
  };
  movies: RoomDataInterface[] = [];
  trendingMovies: any[] = [];
  topRatedMovies: any[] = [];
  topActors: any[] = [];

  readonly pageSize = 10;
  private offset = 0;
  loading = false;



  searchClicked = false;
  resetClicked = false;
  constructor(
    private roomService: RoomService,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.roomService.filterMovie({limit: 0, page: 0, type: [MovieTypes.Horror]}).subscribe({
      next: (m) => {
        console.log('Filtered movies:', m);
      }
    })

    this.personService.filterCast({limit: 5, page: 1, roles: [PersonRoles.Cinematographer]}).subscribe({
      next: (c) => {
        console.log('Filtered cast:', c);
      }
    });

    this.loadTrendingMovies();
    this.loadTopRatedMovies();
    this.loadTopActors();
  }

  private loadTrendingMovies(): void {
    this.roomService.getAllPaginated(12, 0).subscribe(movies => (this.trendingMovies = movies));
  }

  private loadTopRatedMovies(): void {
    this.roomService
      .getAllPaginated(50, 0)
      .pipe(map(arr => arr.sort((a: any, b: any) => (b.averageRating ?? 0) - (a.averageRating ?? 0)).slice(0, 12)))
      .subscribe(sorted => (this.topRatedMovies = sorted));
  }

  private loadTopActors(): void {
    this.personService
      .getAllPaginated(50, 0)
      .pipe(map(arr => arr.sort((a: any, b: any) => (b.averageRating ?? 0) - (a.averageRating ?? 0)).slice(0, 12)))
      .subscribe(sorted => (this.topActors = sorted));
  }

  // ======================= helpers ========================
  getThumbnailUrl(video: any) {
    const theme = localStorage.getItem('theme') || 'light';

    if (video.thumbnail !== 'thumbnail') {
      return this.roomService.getThumbnailUrl(video.thumbnail);
    } else if (theme === 'dark') {
      return this.roomService.getDefaultThumbnail('thumbnail_black.png');
    } else {
      return this.roomService.getDefaultThumbnail('thumbnail_white.png');
    }
  }

  getMoviePoster(movie: any): string {
    return this.roomService.getThumbnailUrl(movie.thumbnail);
  }
  getActorImage(actor: any): string {
    return this.personService.getImage(actor.profilePicture);
  }

  getRatingColor(r: number): string {
    if (r >= 8) return '#21d07a';
    if (r >= 6) return '#d2d531';
    return '#db2360';
  }

  goToMovie(id: string): void {
    this.router.navigate(['/movie', id]);
  }
  goToActor(id: string): void {
    this.router.navigate(['/cast', id]);
  }

  onResetHandler() {
    this.resetClicked = true;
    this.searchClicked = false;
    console.log('Reset apăsat');
  }
  handleSearch(queryParams: {
    name: string;
    category: 'movie' | 'cast';
    filterValue: any;
    sortField: string;
    sortOrder: 'ASC' | 'DESC';
  }) {

    const isDefault =
      queryParams.name === '' &&
      queryParams.category === 'movie' &&
      Array.isArray(queryParams.filterValue?.type) &&
      queryParams.filterValue.type.length === 0 &&
      queryParams.sortField === 'name' &&
      queryParams.sortOrder === 'ASC';

    this.searchClicked = !isDefault;
    this.resetClicked = false;

    if (!isDefault) {
      this.homeSearchParams = queryParams;
    }

  }


}
