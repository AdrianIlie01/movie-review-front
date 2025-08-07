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
        this.topActors = actors;
      });
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
      queryParams.filterValue?.type.length === 0 &&
      (queryParams.filterValue?.releaseYear === '' || queryParams.filterValue?.releaseYear == null) &&
      (queryParams.filterValue?.ratingMin === '' || queryParams.filterValue?.ratingMin == null) &&
      queryParams.sortField === 'name' &&
      queryParams.sortOrder === 'ASC';

    this.searchClicked = !isDefault;
    this.resetClicked = false;

    if (!isDefault) {
      this.homeSearchParams = queryParams;
    }

  }


}
