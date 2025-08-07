import {Component, OnDestroy, OnInit} from '@angular/core';
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
export class MovieCarouselComponent implements OnInit, OnDestroy{
  constructor(
    protected roomService: RoomService,
    private router: Router,
  ) {}

  protected cachedMovies: RoomDataInterface[][] = [];
  protected currentPageIndex = 0;
  protected currentIndex = 0;
  readonly pageSize = 10;
  protected previousMovie: RoomDataInterface | null = null;

  protected loading = false;
  protected noMorePages = false;
  protected firstImageLoaded = false;

  protected animationDirection: 'left' | 'right' | '' = '';

  private dragStartX = 0;
  private dragging = false;
  private autoSlideIntervalId: any = null;
  readonly slideIntervalMs = 5000;
  private autoSlideRestartTimeoutId: any = null;
  protected cameFromFirstToLastMoreDataAvailable: boolean = false;
  readonly clickDelayMs = 500;
  private clickDisabled = false;
  ngOnInit(): void {
    this.loadPage(0);
    setTimeout(() => {
      this.startAutoSlide();
    }, 5000);
  }
  ngOnDestroy(): void {
    clearInterval(this.autoSlideIntervalId);
    this.autoSlideIntervalId = null;

    if (this.autoSlideRestartTimeoutId) {
      clearTimeout(this.autoSlideRestartTimeoutId);
      this.autoSlideRestartTimeoutId = null;
    }
  }
  get currentPage(): RoomDataInterface[] {
    // return all 10 movies from the current page
    return this.cachedMovies[this.currentPageIndex] || [];
  }
  get currentMovie(): RoomDataInterface | null {
    // first we return an array of 10 movies from the current page with this.currentPage
    // and from this array we return the current movie
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
    if (this.clickDisabled) return;
    this.disableClickTemporarily();

    this.pauseAutoSlideWithRestart();
    this.previousMovie = this.currentMovie;
    this.animationDirection = 'right';

    if ( (this.currentIndex == 0 && this.currentPageIndex == 0 ) && !this.noMorePages) {
      // triggered: when we are on the first movie of the first page and we go on the last movie of the last page loaded
      // role: flag that the user went to last movie loaded from the first movie ever loaded
      // so on next() we will go to the first movie of the first page instead of loading more movies

      this.cameFromFirstToLastMoreDataAvailable = true
    }

    if (this.currentIndex > 0) {
      // role: navigate to left through the current page of movies,
      // until we get to the first movie so we need to decrease the currentPageIndex
      this.currentIndex--;
    } else if (this.currentPageIndex > 0) {
      // triggered: when we are on the first movie of the current page and its not the first page
      // role: go to the last movie of the previous page
      this.currentPageIndex--;
      this.currentIndex = this.pageSize - 1;
    } else {
      // triggered: when we go to left from the first movie of the first page
      this.currentPageIndex = this.cachedMovies.length - 1;
      this.currentIndex = (this.cachedMovies.at(-1)?.length || 1) - 1;
    }
    this.resetAnimationDirection();
  }

  next(): void {
    if (this.clickDisabled) return;
    this.disableClickTemporarily();

    this.pauseAutoSlideWithRestart();
    this.previousMovie = this.currentMovie;
    this.animationDirection = 'left';

    if( this.cameFromFirstToLastMoreDataAvailable ) {
      this.currentIndex = 0;
      this.currentPageIndex = 0;
      this.cameFromFirstToLastMoreDataAvailable = false;
    }

    else if (this.currentIndex < this.currentPage.length - 1) {
      //function role: - navigate through the current page of movies

      // increment currentIndex - to go to next movie
      // we dont call load() - we already have this data (10 movies)
      // = when the movie index is smaller than the length of the current page,

      // mechanism to go from last movie loaded on that page to next movie
      // on the penultimate index 8 on next(), we increase it with 1 => 9 and display the data,
      // but now currentIndex = 9 which is not smaller than the length of the current [page - 1] = 9,

      this.currentIndex++;
      this.resetAnimationDirection();
    }

    else if (this.cachedMovies[this.currentPageIndex + 1]  ) {
      // function role: load next page from movieCached if cached (not applying on 1st page),
      // and go on first movie of the next page

      // triggered:on the last movie of the current page - if the next page is cached

      this.currentPageIndex++;
      this.currentIndex = 0;
      this.resetAnimationDirection();
    }

    else if (!this.noMorePages) {
      // function role: CALL BACKEND API = loadPage() - to load next page of movies
      // triggered: if next page is not cached and there are more pages to load

      this.loadPage(this.currentPageIndex + 1, () => {
        this.animationDirection = 'left';
        this.resetAnimationDirection();
      });
    }

    else {
      // triggered: if we reached the last movie of the last page and go to first movie on first page
      // function role: set the current movie with the first movie of the first page else will be stuck on final movie

      this.currentPageIndex = 0;
      this.currentIndex = 0;
      this.resetAnimationDirection();
    }
  }

  private disableClickTemporarily(): void {
    this.clickDisabled = true;
    setTimeout(() => {
      this.clickDisabled = false;
    }, this.clickDelayMs);
  }

  private startAutoSlide(): void {
    this.autoSlideIntervalId = setInterval(() => {
      if (!this.loading && this.firstImageLoaded) {
        this.next();
      }
    }, this.slideIntervalMs);
  }
  private resetAnimationDirection() {
    setTimeout(() => {
      this.animationDirection = '';
      this.previousMovie = null;
    }, 400);
  }
  private loadPage(pageIndex: number, afterLoad?: () => void): void {
    if (this.cachedMovies[pageIndex]) {
      // if the page is already cached, we just set the currentPageIndex and currentIndex
      // so current movie will be the first movie of the page
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
            // no more movies to load, next movie = first movie ever loaded
            // so we set the currentPageIndex and currentIndex to 0
            this.currentPageIndex = 0;
            this.currentIndex = 0;
            return;
          }
          // we cache the movies for the pageIndex and set the new currentPageIndex and currentIndex
          // in order to display the first movie of the new page
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
  pauseAutoSlideWithRestart(): void {
    clearInterval(this.autoSlideIntervalId);
    this.autoSlideIntervalId = null;

    if (this.autoSlideRestartTimeoutId) {
      clearTimeout(this.autoSlideRestartTimeoutId);
    }

    this.autoSlideRestartTimeoutId = setTimeout(() => {
      this.startAutoSlide();
      this.autoSlideRestartTimeoutId = null;
    }, 10000);
  }
  onDragStart(event: PointerEvent): void {
    this.pauseAutoSlideWithRestart();
    (event.target as HTMLElement).setPointerCapture(event.pointerId); // move on touch
    this.dragStartX = event.clientX;
    this.dragging = true;
  }

  onDragMove(event: PointerEvent): void {
    if (!this.dragging) return;
    this.pauseAutoSlideWithRestart();
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
