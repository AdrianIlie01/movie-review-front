import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, firstValueFrom} from "rxjs";
import {UserService} from '../../../features/user/services/user.service';
import {AuthService} from '../../../core/services/auth.service';
import {ThemeService} from '../../../core/services/theme.service';

@Component({
  selector: 'app-navigation-menu',
  standalone: false,
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css'],
})
export class NavigationMenuComponent implements OnInit {
  constructor(
    public themeService: ThemeService,
    private userService: UserService,
    private authService: AuthService,
    // private stripeService: StripeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  // @Output() componentName = new EventEmitter<void>();
  @Input() component_name !: string;

  protected userId!: string;
  protected currentComponentName!: string;
  protected closed: boolean = false;
  protected isLogged!: boolean;
  protected isAdmin: boolean = false;
  protected action!: string;
  protected _2fa!: string;
  protected _2fa_enabled: boolean = false;
  protected profileSubmenuOpen = false;
  protected movieSubmenuOpen = false;
  protected personSubmenuOpen = false;
  async ngOnInit() {

    this.checkLoggedInStatus();

    const isLoggedIn = await firstValueFrom(this.authService.isAuthenticated());

    console.log('isLoggedIn');
    console.log(isLoggedIn);

    if (isLoggedIn) {
      this.checkRole();
      this.userService.getUserInfo().subscribe((res: any) => {
        this.userId = res.id;
      });
    }

    this.router.events.subscribe( async event => {
      if (event instanceof NavigationEnd) {
        this.checkLoggedInStatus();

        const isLoggedIn = await firstValueFrom(this.authService.isAuthenticated());
        if (isLoggedIn) {
          this.checkRole();
        }
      }
    });
  }


  toggleProfileSubmenu(event: Event) {
    event.preventDefault();
    this.profileSubmenuOpen = !this.profileSubmenuOpen;
    if (this.profileSubmenuOpen) {
      this.movieSubmenuOpen = false;
      this.personSubmenuOpen = false;
    }
  }

  toggleMovieSubmenu(event: Event) {
    event.preventDefault();
    this.movieSubmenuOpen = !this.movieSubmenuOpen;
    if (this.movieSubmenuOpen) {
      this.personSubmenuOpen = false;
      this.profileSubmenuOpen = false;
    }
  }

  togglePersonSubmenu(event: Event) {
    event.preventDefault();
    this.personSubmenuOpen = !this.personSubmenuOpen;
    if (this.personSubmenuOpen) {
      this.movieSubmenuOpen = false;
      this.profileSubmenuOpen = false;
    }
  }

  hideNavMenu() {
    const checkboxElement = document.getElementById('openSideMenu') as HTMLInputElement;
    if (checkboxElement !== null) {
      checkboxElement.checked = false;
      this.closed = true;
      this.profileSubmenuOpen = false;
      this.movieSubmenuOpen = false;
      this.personSubmenuOpen = false;
    }
  }

  openCloseSubMenu() {
    const listElement = document.getElementById('profile') as HTMLInputElement;
    if (listElement !== null) {
      console.log('click on profile')
    }
  }

  async checkLoggedInStatus() {
    this.authService.isAuthenticated().subscribe((res: any) => {

      this.isLogged = res;

      if (res) {
        this.action = 'Log out';

        this.userService.getUserInfo().subscribe(
          (res: any) => {
            if (res.roles == 'admin') {
              this.isAdmin = true;
            } else {
              this.isAdmin = false;
            }

            if (res._2fa === true) {
              this._2fa = 'Disable 2FA';
            } else {
              this._2fa = 'Enable 2FA';
            }

          }
        );
      }

      if (!res) {
        this.isLogged = false;
        this.action = 'Log in';
        this._2fa_enabled = false;
        this._2fa = '';
      }

    });

  }
  async logInOut() {
    const isLoggedIn = this.authService.isAuthenticated();

    if (isLoggedIn) {
      this.authService.logout();
        await this.router.navigateByUrl('auth/login');
    }
    if (this.isLogged) {
      // logout user
      this.authService.logout().subscribe({
        next: async (data) => {
          await this.router.navigateByUrl('home');
          await window.location.reload();
        }
      });
    }
    if(!this.isLogged) {
      await this.router.navigateByUrl('auth/login');
    }
  }
  async twoFA() {
    await this.checkLoggedInStatus()
    await this.router.navigateByUrl('auth/two-fa');
  }

  async redirectHome() {
    await this.checkLoggedInStatus()
    await this.router.navigateByUrl('home');
  }

  async userInfo(){
    await this.checkLoggedInStatus()
    this.checkRole();
    await this.router.navigateByUrl('user/info');
  }
  async changeUsername() {
    await this.checkLoggedInStatus()
    await this.router.navigateByUrl('user/edit');
  }

  async updateContactInfo() {
    await this.checkLoggedInStatus()
    await this.router.navigateByUrl('user/update-info');
  }

  async changePassword() {
    await this.checkLoggedInStatus()
    await this.router.navigateByUrl('user/change-password');
  }

  async deleteAccount() {
    await this.checkLoggedInStatus()
    await this.router.navigateByUrl('user/delete-account');
  }

  async changeEmail() {
    await this.checkLoggedInStatus()

    // this.userService.sendOtpResetEmail(this.userId).subscribe(async (res) => {
      await this.router.navigateByUrl('user/change-email');
    // })
  }

  async userList() {
    await this.checkLoggedInStatus()
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('user/list');
      this.currentComponentName= 'User List';
    }
  }

  async roomList() {
    await this.checkLoggedInStatus()
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('movie/list');
      this.currentComponentName= 'Room List';
    }
  }

  async personList() {
    await this.checkLoggedInStatus()
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('cast/list');
      this.currentComponentName= 'Person List';
    }
  }

  async createRoom() {
    await this.checkLoggedInStatus()
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('movie/add');
      this.currentComponentName= 'Create Room';
    }
  }

  async createPerson() {
    await this.checkLoggedInStatus()
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('cast/add');
      this.currentComponentName= 'Create Person';
    }
  }

  async donations() {
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('donations');
      this.currentComponentName= 'Donations';
    }
  }

  async donationHistory() {
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('donation-history');
      this.currentComponentName= 'Donation History';
    }
  }

  async profile() {
    if (this.isLogged) {
      await this.router.navigateByUrl('user/info');
      this.currentComponentName= 'Profile';
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }


  checkRole() {
    const isLoggedIn = this.authService.isAuthenticated();

    if (isLoggedIn) {
      this.userService.getUserInfo().subscribe(
        (res: any) => {
          if (res.roles == 'admin') {
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
          }

        }
      );
    }
  }

}
