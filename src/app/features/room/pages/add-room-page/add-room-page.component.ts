import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {AuthService} from '../../../../core/services/auth.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-add-room-page',
  standalone: false,

  templateUrl: './add-room-page.component.html',
  styleUrl: './add-room-page.component.css'
})
export class AddRoomPageComponent implements OnInit {
  protected userInfo!: any;

  selectedFile!: File | null;
  roomName!: string;

  constructor(
    protected roomService: RoomService,
    protected authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.getUserInfo();
  }


  onFileSelected(event: any) {
    // this.selectedFile = event.target.files[0];
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.selectedFile = input.files[0];
    }
  }

  getUserInfo() {
    this.authService.getUserInfo()
      .subscribe({
        next: (data) => {
          console.log('data');
          console.log(data);

          this.userInfo = data;
        },
        error: (e) => {
          console.error('Eroare este:', e);
        }
      });
  }

  uploadVideo() {
    if (!this.roomName || !this.selectedFile)  {
      console.log('no file or no name');
      return;
    }

    this.roomService.addRoomVideo(this.userInfo.id, this.selectedFile, this.roomName.trim())
      .subscribe({
        next: (data: any) => {
          console.log('roomName');

          console.log(this.roomName);

          this.roomName = '';
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Upload failed', error);
        }
      });
  }

}
