import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {RoomService} from '../../../room/services/room.service';
import {RoomDataInterface} from '../../../../shared/interfaces/room-data.interface';
import {PersonDataInterface} from '../../../../shared/interfaces/person-data.interface';
import {FilterMovie} from '../../../../shared/interfaces/filter-movie.interface';
import {FilterCast} from '../../../../shared/interfaces/filter-cast.interface';
import {finalize} from 'rxjs/operators';
import {PersonService} from '../../../person/services/person.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cast-and-movie-carousel',
  standalone: false,
  templateUrl: './cast-and-movie-carousel.component.html',
  styleUrl: './cast-and-movie-carousel.component.css'
})
export class CastAndMovieCarouselComponent implements OnChanges{
  @Input() searchParams!: {
    name: string;
    category: 'movie' | 'cast';
    filterValue: any;
    sortField: string;
    sortOrder: 'ASC' | 'DESC';
  };
  @Input() newSearch: boolean = false;

  constructor(
    private roomService: RoomService,
    protected personService: PersonService,
    private castService: PersonService,
    private router: Router,
  ) {}

  cachedItems: (RoomDataInterface | PersonDataInterface)[][] = [];
  currentPageIndex = 0;
  currentIndex = 0;
  readonly pageSize = 10;
  previousItem: RoomDataInterface | PersonDataInterface | null = null;

  loading = false;
  private noMorePages = false;

  animationDirection: 'left' | 'right' | '' = '';
  private dragStartX = 0;
  private dragging = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchParams']) {
      this.cachedItems = [];
      this.currentPageIndex = 0;
      this.currentIndex = 0;
      this.noMorePages = false;
      this.loadPage(0);
    }
  }

  get currentPage() {
    return this.cachedItems[this.currentPageIndex] || [];
  }

  get currentItem() {
    return this.currentPage[this.currentIndex] || null;
  }

  getThumbnailUrl(item: any): string {
    const theme = localStorage.getItem('theme') || 'light';
    if (item.thumbnail !== 'thumbnail') return this.roomService.getThumbnailUrl(item.thumbnail);
    return theme === 'dark'
      ? this.roomService.getDefaultThumbnail('thumbnail_black.png')
      : this.roomService.getDefaultThumbnail('thumbnail_white.png');
  }

  getPersonImage(person: any) {
    if (person.images && person.images.length > 0) {
      return this.personService.getImage(person.images[0]);
    } else {
      return this.personService.getDefaultImage('default_person.jpg');
    }
  }

  onImageError(event: Event, item: any) {
    const imgElement = event.target as HTMLImageElement;
    if (this.searchParams.category === 'cast') {
      imgElement.src = this.castService.getDefaultImage('default_person.jpg');
    } else {
      const theme = localStorage.getItem('theme') || 'light';
      imgElement.src = theme === 'dark'
        ? this.roomService.getDefaultThumbnail('thumbnail_black.png')
        : this.roomService.getDefaultThumbnail('thumbnail_white.png');
    }
  }


  previous(): void {
    this.previousItem = this.currentItem;
    this.animationDirection = 'right';
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.currentIndex = this.pageSize - 1;
    } else {
      this.currentPageIndex = this.cachedItems.length - 1;
      this.currentIndex = (this.cachedItems.at(-1)?.length || 1) - 1;
    }
    this.resetAnimationDirection();
  }

  next(): void {
    this.previousItem = this.currentItem;
    this.animationDirection = 'left';
    if (this.currentIndex < this.currentPage.length - 1) {
      this.currentIndex++;
      this.resetAnimationDirection();
    } else if (!this.noMorePages) {
      this.loadPage(this.currentPageIndex + 1, () => {
        this.animationDirection = 'left';
        this.resetAnimationDirection();
      });
    } else {
      this.currentPageIndex = 0;
      this.currentIndex = 0;
      this.resetAnimationDirection();
    }
  }

  private resetAnimationDirection() {
    setTimeout(() => {
      this.animationDirection = '';
      this.previousItem = null;
    }, 400);
  }

  private loadPage(pageIndex: number, afterLoad?: () => void): void {
    if (this.cachedItems[pageIndex]) {
      this.currentPageIndex = pageIndex;
      this.currentIndex = 0;
      afterLoad?.();
      return;
    }
    if (this.loading || !this.searchParams) return;

    this.loading = true;
    const offset = pageIndex * this.pageSize;
    const commonParams = {
      ...this.searchParams.filterValue,
      name: this.searchParams.name,
      sortField: this.searchParams.sortField,
      sortOrder: this.searchParams.sortOrder,
      page: pageIndex + 1,
      limit: this.pageSize
    };

    const serviceCall =
      this.searchParams.category === 'movie'
        ? this.roomService.filterMovie(commonParams as FilterMovie)
        : this.castService.filterCast(commonParams as FilterCast);

    serviceCall.pipe(finalize(() => (this.loading = false))).subscribe({
      next: (data: any) => {
        if (!data.length) {
          this.noMorePages = true;
          return;
        }
        this.cachedItems[pageIndex] = data;
        this.currentPageIndex = pageIndex;
        this.currentIndex = 0;
        afterLoad?.();
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }

  goToDetails(item: any) {
    if (!item || !this.searchParams?.category) return;

    if (this.searchParams.category === 'movie') {
      this.router.navigate(['/movie', item.id]);
    } else if (this.searchParams.category === 'cast') {
      this.router.navigate(['/cast', item.id]);
    }
  }

  onDragStart(event: PointerEvent): void {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    this.dragStartX = event.clientX;
    this.dragging = true;
  }

  onDragMove(event: PointerEvent): void {
    if (!this.dragging) return;
  }

  onDragEnd(event: PointerEvent): void {
    if (!this.dragging) return;
    const deltaX = event.clientX - this.dragStartX;
    this.dragging = false;

    const threshold = 50;
    if (deltaX > threshold) this.previous();
    else if (deltaX < -threshold) this.next();
  }

  onDragCancel(): void {
    this.dragging = false;
  }
}
