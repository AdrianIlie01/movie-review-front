import {AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {ButtonName} from '../../../../shared/enums/button-name';
import {Router} from '@angular/router';
import {CardsVisibilityService} from '../../../../shared/services/cards-visibility.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-list-room-page',
  standalone: false,

  templateUrl: './list-room-page.component.html',
  styleUrl: './list-room-page.component.css'
})
export class ListRoomPageComponent implements OnInit {
  @ViewChild('moviesContainer') moviesContainer!: ElementRef;

  protected videos: any[] = [];
  protected loading = false;
  protected ButtonName = ButtonName;
  protected noMore = false;
  protected limit = environment.limit;
  protected offset = 0;
  protected initialAutoloadDone = false;
  constructor(
    protected router: Router,
    protected roomService: RoomService,
  protected gridVisibilityService: CardsVisibilityService
) {
  }


  ngOnInit() {
    this.checkIfInitialLoadNeeded();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.loading || this.noMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;

    if (scrollPosition >= threshold) {
      this.loadMoreVideos();
    }
  }

  checkIfInitialLoadNeeded(): void {
    if (!this.moviesContainer) {
      this.loadMoreVideos(true);
      return;
    }

    const container = this.moviesContainer.nativeElement as HTMLElement;
    const { cardsPerRow, visibleRows } = this.gridVisibilityService.getCardsPerRowAndVisibleRows(container, '.movie-card');

    if (cardsPerRow === 0 || visibleRows === 0) {
      this.loadMoreVideos(true);
      return;
    }

    const maxCardsVisible = cardsPerRow * visibleRows;
    const currentCardsCount = this.videos.length;

    if (currentCardsCount < maxCardsVisible) {
      this.loadMoreVideos(true);
    } else {
      this.initialAutoloadDone = true;
    }
  }

  loadMoreVideos(checkAfterLoad = false): void {
    if (this.loading || this.noMore) return;

    this.loading = true;

    this.roomService.getAllPaginated(this.limit, this.offset).subscribe({
      next: (data: any[]) => {
        if (data.length === 0) {
          this.noMore = true;
        } else {
          this.videos.push(...data);
          this.offset += this.limit;
        }

        this.loading = false;

        if (checkAfterLoad && !this.initialAutoloadDone) {
          this.checkIfInitialLoadNeeded();
        }
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        this.loading = false;
      }
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

  editVideo(id: any){
    this.router.navigateByUrl(`/room/edit/${id}`);
  }

  managePersonsPerRolePerMovie(movieId: any){
    this.router.navigateByUrl(`credits/cast/${movieId}`);
  }

  onImageError(event: Event, video: any) {
    const theme = localStorage.getItem('theme') || 'light';
    const imgElement = event.target as HTMLImageElement;

    if (theme === 'dark') {
      imgElement.src = this.roomService.getDefaultThumbnail('thumbnail_black.png');
    } else {
      imgElement.src = this.roomService.getDefaultThumbnail('thumbnail_white.png');
    }
  }
}
