import { Component } from '@angular/core';
import {finalize} from 'rxjs/operators';
import {RoomService} from '../../../room/services/room.service';
import {RoomDataInterface} from '../../../../shared/interfaces/room-data.interface';
import {Router} from '@angular/router';

@Component({
  selector: 'app-movie-carousel',
  standalone: false,
  templateUrl: './movie-carousel.component.html',
  styleUrl: './movie-carousel.component.css'
})
export class MovieCarouselComponent {
  constructor(
    protected roomService: RoomService,
    private router: Router,
  ) {}

  cachedMovies: RoomDataInterface[][] = [];
  currentPageIndex = 0;
  currentIndex = 0;
  readonly pageSize = 10;
  previousMovie: RoomDataInterface | null = null;

  protected loading = false;
  private noMorePages = false;
  protected firstImageLoaded = false;

  animationDirection: 'left' | 'right' | '' = '';

  private dragStartX = 0;
  private dragging = false;

  ngOnInit(): void {
    this.loadPage(0);
  }

  get currentPage(): RoomDataInterface[] {
    return this.cachedMovies[this.currentPageIndex] || [];
  }
  get currentMovie(): RoomDataInterface | null {
    return this.currentPage[this.currentIndex] || null;
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

  onImageLoad(): void {
    if (!this.firstImageLoaded) {
      this.firstImageLoaded = true;
    }
  }

  previous(): void {
    this.previousMovie = this.currentMovie;
    this.animationDirection = 'right';
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.currentIndex = this.pageSize - 1;
    } else {
      this.currentPageIndex = this.cachedMovies.length - 1;
      this.currentIndex = (this.cachedMovies.at(-1)?.length || 1) - 1;
    }
    this.resetAnimationDirection();
  }

  next(): void {
    this.previousMovie = this.currentMovie;
    this.animationDirection = 'left';
    if (this.currentIndex < this.currentPage.length - 1) {
      this.currentIndex++;
      this.resetAnimationDirection();
    } else if (!this.noMorePages) {
      // → load next page async
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
      this.previousMovie = null;
    }, 400);
  }
  private loadPage(pageIndex: number, afterLoad?: () => void): void {
    if (this.cachedMovies[pageIndex]) {
      this.currentPageIndex = pageIndex;
      this.currentIndex = 0;
      afterLoad?.();
      return;
    }
    if (this.loading) return;

    this.loading = true;
    const offset = pageIndex * this.pageSize;

    this.roomService
      .getAllPaginated(this.pageSize, offset)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data) => {
          if (data.length === 0) {
            this.noMorePages = true;
            this.currentPageIndex = 0;
            this.currentIndex = 0;
            return;
          }
          this.cachedMovies[pageIndex] = data;
          this.currentPageIndex = pageIndex;
          this.currentIndex = 0;
          afterLoad?.();
        },
        error: (err) => console.error('Failed to load movies', err),
      });
  }

  goToMovie(id: string | number) {
    this.router.navigateByUrl(`/movie/${id}`);
  }
  onDragStart(event: PointerEvent): void {
    (event.target as HTMLElement).setPointerCapture(event.pointerId); // move on touch
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

    const threshold = 50; // px
    if (deltaX > threshold) this.previous();
    else if (deltaX < -threshold) this.next();
  }

  onDragCancel(event: PointerEvent): void {
    this.dragging = false;
  }
}
