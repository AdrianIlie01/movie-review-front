import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RoomService} from '../../../room/services/room.service';
import {PersonService} from '../../../person/services/person.service';
import {map} from 'rxjs/operators';
import {RoomDataInterface} from '../../../../shared/interfaces/room-data.interface';
import {FilterMovie} from '../../../../shared/interfaces/filter-movie.interface';
import {FilterCast} from '../../../../shared/interfaces/filter-cast.interface';

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
  topRatedMovies: any[] = [];
  topActors: any[] = [];

  loading = false;
  searchClicked = false;
  resetClicked = false;
  constructor(
    private roomService: RoomService,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTopRatedMovies();
    this.loadTopActors();
  }

  private loadTopRatedMovies(): void {
    const query: FilterMovie = {
      ratingMin: 0,
      sortField: 'rating',
      sortOrder: 'DESC',
      limit: 10,
      page: 1
    };

    this.roomService
      .filterMovie(query)
      .subscribe({
        next: (movies: any) => {
          console.log('movies', movies);
          this.topRatedMovies = movies;
        }
      });

  }

  private loadTopActors(): void {
    const query: FilterCast = {
      ratingMin: 0,
      sortField: 'rating',
      sortOrder: 'DESC',
      limit: 10,
      page: 1
    };

    this.personService
      .filterCast(query)
      .subscribe((actors: any) => {
        console.log('actors', actors);
        this.topActors = actors;
      });
  }

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

  getPersonImage(person: any) {
    if (person.images && person.images.length > 0) {
      return this.personService.getImage(person.images[0]);
    } else {
      return this.personService.getDefaultImage('default_person.jpg');
    }
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
      Array.isArray(queryParams.filterValue?.type) &&
      queryParams.filterValue?.type.length === 0 &&
      Array.isArray(queryParams.filterValue?.releaseYear) &&
      queryParams.filterValue?.releaseYear.length === 0 &&
      queryParams.sortField === 'name' &&
      queryParams.sortOrder === 'ASC';

    this.searchClicked = !isDefault;
    this.resetClicked = false;

    if (!isDefault) {
      this.homeSearchParams = queryParams;
    }

  }


}
