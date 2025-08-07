import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PersonService} from '../../../person/services/person.service';
import {RatingService} from '../../../../shared/services/rating.service';
import {Router} from '@angular/router';
import {FilterCast} from '../../../../shared/interfaces/filter-cast.interface';
import {TOP_CAST_MOVIE_COUNT} from '../../../../shared/utils/constants';

@Component({
  selector: 'app-top-cast-carousel',
  standalone: false,
  templateUrl: './top-cast-carousel.component.html',
  styleUrl: './top-cast-carousel.component.css'
})
export class TopCastCarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel', { static: true }) carouselRef!: ElementRef;

  protected topActors: any[] = [];
  protected startX = 0;
  protected isDragging = false;
  protected atStart = true;
  protected atEnd = false;
  protected placeholderArray = TOP_CAST_MOVIE_COUNT;
  protected loading = true;

  constructor(
    private cdr: ChangeDetectorRef,
    private personService: PersonService,
    private ratingService: RatingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTopRatedActors();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.checkScroll(), 0); // wait for view
  }

  private loadTopRatedActors(): void {
    const query: FilterCast = {
      ratingMin: 0,
      sortField: 'rating',
      sortOrder: 'DESC',
      limit: 10,
      page: 1
    };

    this.personService.filterCast(query).subscribe((actors: any) => {
      const withRatings = actors.map((actor: any) => ({ ...actor, rating: null }));

      withRatings.forEach((actor: any) => {
        this.ratingService.calculatePersonOrMovieAverageRating(actor.id).subscribe({
          next: (res: any) => {
            actor.rating = res?.averageRating ?? null;
          }
        });
      });

      this.topActors = withRatings;
      this.loading = false;
      this.cdr.detectChanges();
      this.checkScroll();
    });
  }

  getPersonImage(person: any): string {
    if (person.images && person.images.length > 0) {
      return this.personService.getImage(person.images[0]);
    } else {
      return this.personService.getDefaultImage('default_person.jpg');
    }
  }

  onImageError(event: Event, video: any) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.personService.getDefaultImage('default_person.jpg');

  }

  goToActor(id: string | number): void {
    this.router.navigate(['/cast', id]);
  }

  scroll(direction: 'left' | 'right') {
    const el = this.carouselRef.nativeElement as HTMLElement;
    const scrollAmount = 170;

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });

    setTimeout(() => this.checkScroll(), 300); // ~duration of scroll
  }

  onPointerDown(event: PointerEvent | TouchEvent) {
    this.startX = this.getClientX(event);
    this.isDragging = true;
  }

  onPointerMove(event: PointerEvent | TouchEvent) {
    if (!this.isDragging) return;
  }

  onPointerUp(event: PointerEvent | TouchEvent) {
    if (!this.isDragging) return;
    const deltaX = this.getClientX(event) - this.startX;

    if (deltaX > 50) this.scroll('left');
    else if (deltaX < -50) this.scroll('right');

    this.isDragging = false;
  }

  onPointerCancel() {
    this.isDragging = false;
  }

  private getClientX(event: TouchEvent | PointerEvent): number {
    return event instanceof TouchEvent ? event.touches[0]?.clientX || 0 : event.clientX;
  }

  checkScroll() {
    const el = this.carouselRef.nativeElement;

    if (el.scrollWidth <= el.clientWidth) {
      this.atStart = true;
      this.atEnd = true;
    } else {
      this.atStart = el.scrollLeft <= 5;
      this.atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 5;
    }
  }
}
