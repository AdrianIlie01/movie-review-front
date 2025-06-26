import {Component, OnDestroy, OnInit} from '@angular/core';
import {ButtonName} from '../../../../shared/enums/button-name';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {HomeService} from '../../services/home.service';

@Component({
  selector: 'app-home-page',
  standalone: false,

  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy {
  protected ActionButton = ButtonName;

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  async ngOnInit() {

    // document.cookie = "username=angular_user; path=/; max-age=604800"; // 7 zile

  //   this.authService.verify().subscribe({
  //     next: (r) => {
  //       console.log('works');
  //     },
  //
  //     error: (e) => {
  //       console.error('Eroare la verificare:', e);
  //     }
  //   });

  }

  ngOnDestroy() {
    // document.cookie = "username=; path=/; max-age=0;";

  }

  async redirectAuth() {
    await this.router.navigateByUrl('auth/register')
  }

  handleSave() {
    console.log('Save action triggered');
    // Adaugă logica pentru salvare
  }

  handleEdit() {
    console.log('Edit action triggered');
    // Adaugă logica pentru editare
  }

  handleDelete() {
    console.log('Delete action triggered');
  }

  async redirectLogin() {
   await this.router.navigateByUrl('auth/login');
  }

  async redirectEdit() {
    console.log('try');

   await this.router.navigateByUrl('user/edit');
  }

  async addVideo() {
    console.log('try');

    await this.router.navigateByUrl('room/add');
  }
  logout() {
    this.authService.logout().subscribe((data) => {
      console.log(data)
    });
  }

  // downloadVideo() {
  //   const name = 'Connect-R - Vara Nu Dorm - Official Video (20)(1).mp4';
  //
  //   this.homeService.getVideo(name).subscribe((data: Blob) => {
  //
  //     const videoUrl = window.URL.createObjectURL(data);
  //
  //     // const videoBlob = new Blob([data], { type: 'video/mp4' });
  //     // const videoObjectUrl = URL.createObjectURL(videoBlob);
  //
  //
  //     // Crează un element link (a) pentru a permite utilizatorului să descarce fișierul
  //     const link = document.createElement('a');
  //     // link.href = videoObjectUrl;
  //
  //     link.href = videoUrl;
  //     link.download = name; // Numele fișierului pentru descărcare
  //
  //     // Simulează un click pe link pentru a iniția descărcarea
  //     link.click();
  //
  //     // Revocă URL-ul Blob după descărcare
  //     window.URL.revokeObjectURL(videoUrl);
  //   });
  // }
}
