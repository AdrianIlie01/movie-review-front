import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import { PersonInterface } from '../../../../shared/interfaces/person.interface';
import { ButtonName } from '../../../../shared/enums/button-name';
import { Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { environment } from '../../../../../environments/environment';
import { MoviePersonService } from '../../../movie-person/services/movie-person.service';
import { CardsVisibilityService } from '../../../../shared/services/cards-visibility.service';
import { LIMIT_LOADING_DATA } from '../../../../shared/utils/constants';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-person-list',
  standalone: false,
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent implements OnInit, AfterViewInit {
  @ViewChild('castContainer') castContainer!: ElementRef;

  protected people: PersonInterface[] = [];
  protected loading = false;
  protected loadingFirstPersons = true;
  protected readonly ButtonName = ButtonName;
  protected errorDataBase: boolean = false;
  protected noMore = false;
  protected limit = environment.limit;
  protected offset = 0;
  protected initialAutoloadDone = false;
  protected dataLimit = LIMIT_LOADING_DATA;

  protected isFiltered = false;
  protected searchParams: any = null;

  constructor(
    protected router: Router,
    protected personService: PersonService,
    protected castService: MoviePersonService,
    protected gridVisibilityService: CardsVisibilityService
  ) {}

  ngOnInit() {
    this.loadMorePeople(true);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkIfInitialLoadNeeded();
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.loading || this.noMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;

    if (scrollPosition >= threshold) {
      this.loadMorePeople();
    }
  }

  checkIfInitialLoadNeeded(): void {
    if (!this.castContainer) return;


    const container = this.castContainer.nativeElement as HTMLElement;
    const { cardsPerRow, visibleRows } = this.gridVisibilityService.getCardsPerRowAndVisibleRows(container, '.person-card');


    if (cardsPerRow === 0 || visibleRows === 0) {
      this.loadMorePeople(true);
      return;
    }

    const maxCardsVisible = cardsPerRow * visibleRows;
    const currentCardsCount = this.people.length;


    if (currentCardsCount < maxCardsVisible) {
      this.loadMorePeople(true);
    } else {
      this.initialAutoloadDone = true;
    }
  }

  loadMorePeople(checkAfterLoad = false) {
    if (this.loading || this.noMore) return;

    this.loading = true;

    let query$: Observable<any>;

    if (this.isFiltered) {
      const filterQuery: any = {
        name: this.searchParams.name || '',
        born: this.searchParams.filterValue?.born || '',
        roles: this.searchParams.filterValue?.roles || [],
        ratingMin: this.searchParams.filterValue?.ratingMin,
        sortField: this.searchParams.sortField || 'name',
        sortOrder: this.searchParams.sortOrder || 'ASC',
        page: this.offset / this.limit + 1,
        limit: this.limit
      };

      query$ = this.personService.filterCast(filterQuery);
    } else {
      query$ = this.personService.getAllPaginated(this.limit, this.offset);
    }

    query$.subscribe({
      next: (data: PersonInterface[]) => {
        if (data.length === 0) {
          this.noMore = true;
        } else {
          this.people.push(...data);
          this.offset += this.limit;
        }
        this.loading = false;
        this.errorDataBase = false;
        this.loadingFirstPersons = false;

        if (checkAfterLoad && !this.initialAutoloadDone) {
          this.checkIfInitialLoadNeeded();
        }
      },
      error: () => {
        this.loading = false;
        this.errorDataBase = true;
        this.loadingFirstPersons = false;
      }
    });
  }

  loadFilteredPeople(searchParams: any): void {
    searchParams.category = 'cast';

    const isDefault =
      searchParams.name === '' &&
      searchParams.category === 'cast' &&
      Array.isArray(searchParams.filterValue?.type) &&
      searchParams.filterValue?.roles.length === 0 &&
      (searchParams.filterValue?.born === '' || searchParams.filterValue?.born == null) &&
      searchParams.sortField === 'name' &&
      searchParams.sortOrder === 'ASC';

    if (isDefault && this.isFiltered) {
      this.resetToUnfiltered();
      return;
    }

    if (isDefault) {
      return;
    }

    this.people = [];
    this.offset = 0;
    this.noMore = false;
    this.loadingFirstPersons = true;
    this.isFiltered = true;
    this.searchParams = searchParams;
    this.initialAutoloadDone = false;

    this.loadMorePeople(true);
  }

  resetToUnfiltered(): void {
    if (!this.isFiltered && !this.searchParams) return;


    this.people = [];
    this.offset = 0;
    this.noMore = false;
    this.loadingFirstPersons = true;
    this.isFiltered = false;
    this.searchParams = null;
    this.initialAutoloadDone = false;

    this.loadMorePeople(true);
  }

  displayMovies(personId: any) {
    this.router.navigateByUrl(`/credits/filmography/${personId}`);
  }

  editPerson(id: string) {
    this.router.navigateByUrl(`/cast/edit/${id}`);
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
    const unique = new Set(
      person.movieRoles
        .map((p: any) => p.room?.name)
        .filter(Boolean)
    );

    return Array.from(unique);
  }

  onImageError(event: Event, person: PersonInterface) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.personService.getDefaultImage('default_person.jpg');
  }

  onImgClick(event: Event, person: PersonInterface) {
    this.router.navigateByUrl(`/cast/${person.id}`);
  }

  get showPeople(): boolean {
    return (this.people?.length ?? 0) > 0 && !this.errorDataBase;
  }
}
