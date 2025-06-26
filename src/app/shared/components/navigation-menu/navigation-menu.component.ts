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

  currentComponentName!: string;
  closed: boolean = false;
  isLogged!: boolean;
  isAdmin: boolean = false;
  action!: string;
  async ngOnInit() {

    this.checkLoggedInStatus();

    const isLoggedIn = await firstValueFrom(this.authService.isAuthenticated());
    console.log('isLoggedIn');
    console.log(isLoggedIn);

    if (isLoggedIn) {
      this.checkRole();
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

  hideNavMenu() {
    const checkboxElement = document.getElementById('openSideMenu') as HTMLInputElement;
    if (checkboxElement !== null) {
      checkboxElement.checked = false;
      this.closed = true;
    }
  }


  async checkLoggedInStatus() {
    this.authService.isAuthenticated().subscribe((res: any) => {

      this.isLogged = res;

      console.log('isLogged');
      console.log(res)

      if (res) {
        this.action = 'Log out';

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

      if (!res) {
        this.isLogged = false;
        this.action = 'Log in';
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

  async redirectHome() {
    await this.router.navigateByUrl('home');
  }

  async userInfo() {
    await this.router.navigateByUrl('user/info');
  }
  async changeUsername() {
    await this.router.navigateByUrl('user/edit');
  }

  async updateContactInfo() {
    await this.router.navigateByUrl('user/update-info');
  }

  async changePassword() {
    await this.router.navigateByUrl('user/change-password');
  }

  async changeEmail() {
    await this.router.navigateByUrl('user/change-email');
  }

  async userList() {
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('user/list');
      this.currentComponentName= 'User List';
    }
  }

  async roomList() {
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('room/list');
      this.currentComponentName= 'Room List';
    }
  }

  async createRoom() {
    this.checkRole();
    if (this.isLogged && this.isAdmin) {
      await this.router.navigateByUrl('room/add');
      this.currentComponentName= 'Create Room';
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
          console.log('checkRole');
          console.log(res);
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
