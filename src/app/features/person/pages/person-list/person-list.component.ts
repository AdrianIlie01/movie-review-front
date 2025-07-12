import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import {PersonInterface} from '../../../../shared/interfaces/person.interface';
import {ButtonName} from '../../../../shared/enums/button-name';
import {Router} from '@angular/router';
import {PersonService} from '../../services/person.service';
import {environment} from '../../../../../environments/environment';
import {MoviePersonService} from '../../../movie-person/services/movie-person.service';
import {CardsVisibilityService} from '../../../../shared/services/cards-visibility.service';

@Component({
  selector: 'app-person-list',
  standalone: false,

  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent implements OnInit {
  @ViewChild('castContainer') castContainer!: ElementRef;

  protected people: PersonInterface[] = [];
  protected loading = false;
  protected readonly ButtonName = ButtonName;
  protected errorDataBase: boolean = false;
  protected noMore = false;
  protected limit = environment.limit;
  protected offset = 0;
  protected initialAutoloadDone = false;

  constructor(
    protected router: Router,
    protected personService: PersonService,
    protected castService: MoviePersonService,
    protected gridVisibilityService: CardsVisibilityService
  ) {}
  private personApi: string = `${environment.apiUrl}/person`;

  ngOnInit() {
    this.checkIfInitialLoadNeeded();
  }

  checkIfInitialLoadNeeded(): void {
    if (!this.castContainer) {
      this.loadMorePeople(true);
      return;
    }

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

    this.personService.getAllPaginated(this.limit, this.offset).subscribe({
      next: (data: PersonInterface[]) => {
        if (data.length === 0) {
          this.noMore = true;
        } else {
          this.people.push(...data);
          this.offset += this.limit;
        }
        this.loading = false;
        this.errorDataBase = false;

        if (checkAfterLoad && !this.initialAutoloadDone) {
          this.checkIfInitialLoadNeeded();
        }
      },
      error: () => {
        this.loading = false;
        this.errorDataBase = true;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.loading || this.noMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;

    if (scrollPosition >= threshold) {
      // La scroll, încarc simplu fără verificări
      this.loadMorePeople();
    }
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
