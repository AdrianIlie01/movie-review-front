import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {RoomDataInterface} from '../../../../shared/interfaces/room-data.interface';
import {RoomService} from '../../../room/services/room.service';
import {Router} from '@angular/router';
import {FilterMovie} from '../../../../shared/interfaces/filter-movie.interface';
import {RatingService} from '../../../../shared/services/rating.service';
import {map, Observable} from 'rxjs';

@Component({
  selector: 'app-top-movies-carousel',
  standalone: false,
  templateUrl: './top-movies-carousel.component.html',
  styleUrl: './top-movies-carousel.component.css'
})
export class TopMoviesCarouselComponent implements OnInit, AfterViewInit  {
  @ViewChild('carousel', { static: true }) carouselRef!: ElementRef;

  protected startX = 0;
  protected isDragging = false;
  protected topRatedMovies: any[] = [];
  protected atStart = true;
  protected atEnd = false;
  protected averageRating: number = 0;
  ngAfterViewInit() {
    // Used setTimeout to delay checkScroll() until after Angular's change detection cycle to avoid error
    setTimeout(() => this.checkScroll(), 0);
  }

  scrollX = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private roomService: RoomService,
    private ratingService: RatingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTopRatedMovies();
  }

  private loadTopRatedMovies(): void {
    const query: FilterMovie = {
      ratingMin: 0,
      sortField: 'rating',
      sortOrder: 'DESC',
      limit: 10,
      page: 1
    };

    this.roomService.filterMovie(query).subscribe({
      next: (movies: any) => {
        const withRatings = movies.map((movie: any) => ({
          ...movie,
          rating: 0
        }));

        withRatings.forEach((movie: any) => {
          this.ratingService.calculatePersonOrMovieAverageRating(movie.id).subscribe({
            next: (res: any) => {
              movie.rating = res?.averageRating ?? 0;
            }
          });
        });

        this.topRatedMovies = withRatings;
        this.cdr.detectChanges();
        this.checkScroll();
      }
    });
  }

  getThumbnailUrl(video: any): string {
    const theme = localStorage.getItem('theme') || 'light';
    if (video.thumbnail !== 'thumbnail') return this.roomService.getThumbnailUrl(video.thumbnail);
    return theme === 'dark'
      ? this.roomService.getDefaultThumbnail('thumbnail_black.png')
      : this.roomService.getDefaultThumbnail('thumbnail_white.png');
  }

  onImageError(event: Event, video: any) {
    const theme = localStorage.getItem('theme') || 'light';
    (event.target as HTMLImageElement).src =
      theme === 'dark'
        ? this.roomService.getDefaultThumbnail('thumbnail_black.png')
        : this.roomService.getDefaultThumbnail('thumbnail_white.png');
  }
  goToMovie(id: string | number): void {
    this.router.navigate(['/movie', id]);
  }

  scroll(direction: 'left' | 'right') {
    const el = this.carouselRef.nativeElement as HTMLElement;
    const scrollAmount = 240;

    if (direction === 'left') {
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    // Wait ~300ms to allow smooth scroll animation to finish before checking position
    setTimeout(() => this.checkScroll(), 300);
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

    const threshold = 50; // în px
    if (deltaX > threshold) this.scroll('left');
    else if (deltaX < -threshold) this.scroll('right');

    this.isDragging = false;
  }

  onPointerCancel() {
    this.isDragging = false;
  }

  getClientX(event: TouchEvent | PointerEvent): number {
    return (event instanceof TouchEvent)
      ? event.touches[0]?.clientX || 0
      : event.clientX;
  }

  checkScroll() {
    const el = this.carouselRef.nativeElement;

    const isScrollable = el.scrollWidth > el.clientWidth;

    if (!isScrollable) {
      this.atStart = true;
      this.atEnd = true;
    } else {
      this.atStart = el.scrollLeft <= 5;
      this.atEnd = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 5;
    }
  }

}
