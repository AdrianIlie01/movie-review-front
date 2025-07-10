import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {FirebaseService} from '../../../../core/services/firebase';

@Component({
  selector: 'app-room-page',
  standalone: false,

  templateUrl: './room-page.component.html',
  styleUrl: './room-page.component.css'
})
export class RoomPageComponent implements OnInit {
  protected roomId!: string;

  videoUrl: SafeUrl | null = null;
  imageUrl: SafeUrl | null = null;

  // image1: string = 'http://localhost:3000/room/get-video/imagine.png';

// encImage = encodeURIComponent(this.image1);

  constructor(
    private roomService: RoomService,
    private firebaseService: FirebaseService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.roomId = params['id'];

      this.getVideo();

    })

    const x = this.firebaseService.getComments('1');

    console.log(x);


  }

  getVideo() {
    const name = 'Connect-R - Vara Nu Dorm - Official Video (20).mp4';

    this.roomService.getVideo(name).subscribe({
      next: (data) => {
        const videoBlob = new Blob([data], { type: 'video/mp4' });
        const videoObjectUrl = URL.createObjectURL(videoBlob);

        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(videoObjectUrl); // Evită problemele cu Angular Security

      },
    error: (error) => {
      console.error('Eroare la obținerea video-ului:', error);
    }
    });
  }

}
