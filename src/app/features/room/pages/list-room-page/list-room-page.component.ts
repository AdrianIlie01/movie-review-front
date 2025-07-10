import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {ButtonName} from '../../../../shared/enums/button-name';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list-room-page',
  standalone: false,

  templateUrl: './list-room-page.component.html',
  styleUrl: './list-room-page.component.css'
})
export class ListRoomPageComponent implements OnInit {
  protected videos: any[] = [];
  protected loading = false;
  protected ButtonName = ButtonName;
  constructor(
    protected router: Router,
    protected roomService: RoomService
  ) {
  }


  ngOnInit() {
    this.loading = true;
    this.roomService.getAllRooms().subscribe({
      next: (data: any[]) => {
        this.videos = data;
        console.log(data)
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading videos:', err);
        this.loading = false;
      }
    });
  }


  getThumbnailUrl(video:any) {
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
     // this.router.navigateByUrl(`/manage-cast/${movieId}/${role}`);
  }

  onImageError(event: Event, video: any) {
    const theme = localStorage.getItem('theme') || 'light';
    const imgElement = event.target as HTMLImageElement;

      // imgElement.src = this.roomService.getDefaultThumbnail('1.jpg');

    if (theme === 'dark') {
      imgElement.src = this.roomService.getDefaultThumbnail('thumbnail_black.png');
    } else {
      imgElement.src = this.roomService.getDefaultThumbnail('thumbnail_white.png');
    }
  }


}





