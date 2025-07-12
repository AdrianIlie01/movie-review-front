import {AfterViewChecked, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserInterface} from '../../../../shared/interfaces/user.interface';
import {AuthService} from '../../../../core/services/auth.service';
import {CardsVisibilityService} from '../../../../shared/services/cards-visibility.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-user-list-page',
  standalone: false,

  templateUrl: './user-list-page.component.html',
  styleUrl: './user-list-page.component.css'
})
export class UserListPageComponent implements OnInit {
  @ViewChild('container') containerRef!: ElementRef;

  constructor(
    protected authService: AuthService,
    protected userService: UserService,
    private gridVisibilityService: CardsVisibilityService,
  ) {
  }

  protected users: UserInterface[] = [];
  protected currentUserId!: string;
  protected loadingUserId: string | null = null;
  protected loading = false;
  protected currentUserData!: UserInterface;
  protected noMore = false;
  protected limit = environment.limit;
  protected offset = 0;
  protected initialAutoloadDone = false;


  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((loggedIn) => {
      if (loggedIn) {
        this.userService.getUserInfo().subscribe((user: any) => {
          this.currentUserId = user.id;
          this.currentUserData = user;
          this.users = [user];
          this.checkIfInitialLoadNeeded();
        });
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.loading || this.noMore) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 300;

    if (scrollPosition >= threshold) {
      this.loadMoreUsers();
    }
  }


  loadMoreUsers(checkAfterLoad = false): void {
    if (this.loading || this.noMore) return;

    this.loading = true;

    this.userService.getAllPaginated(this.limit, this.offset).subscribe({
      next: (fetched: UserInterface[]) => {
        if (fetched.length === 0) {
          this.noMore = true;
        } else {
          this.users.push(...fetched);
          this.offset += this.limit;
        }
        this.loading = false;

        if (checkAfterLoad && !this.initialAutoloadDone) {
          this.checkIfInitialLoadNeeded();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Error fetching users:', err);
      }
    });
  }

  checkIfInitialLoadNeeded(): void {
    if (!this.containerRef) {
      this.loadMoreUsers(true);
      return;
    }

    const container = this.containerRef.nativeElement as HTMLElement;
    const { cardsPerRow, visibleRows } = this.gridVisibilityService.getCardsPerRowAndVisibleRows(container, '.person-card');


    if (cardsPerRow === 0 || visibleRows === 0) {
      this.loadMoreUsers(true);
      return;
    }

    const maxCardsVisible = cardsPerRow * visibleRows;
    const currentCardsCount = this.users.length;


    if (currentCardsCount < maxCardsVisible) {
      this.loadMoreUsers(true);
    } else {
      this.initialAutoloadDone = true;
    }
  }


  onRoleChange(user: UserInterface) {
    this.loadingUserId = user.id;
    const oldRole = user.role;

    this.userService.changeRole({ role: user.role }, user.id).subscribe({
      next: (res) => {
        this.loadingUserId = null;
      },
      error: (err) => {
        user.role = oldRole;
        this.loadingUserId = null;
      }
    });
  }

  toggleBanUser(user: UserInterface): void {
    this.loadingUserId = user.id;

    if (user.status === 'banned') {
      this.userService.unBanUser(user.id).subscribe({
        next: () => {
          console.log(`User ${user.id} unbanned successfully.`);
          this.loadingUserId = null;
          // Actualizează statusul userului local
          this.users = this.users.map(u =>
            u.id === user.id ? { ...u, is_banned: false, status: 'active' } : u
          );
        },
        error: (error) => {
          console.error(`Failed to unban user ${user.id}`, error);
          this.loadingUserId = null;
        }
      });
    } else {
      // Dacă nu e banat, apelăm ban
      this.userService.banUser(user.id).subscribe({
        next: () => {
          console.log(`User ${user.id} banned successfully.`);
          this.loadingUserId = null;
          // Actualizează statusul userului local
          this.users = this.users.map(u =>
            u.id === user.id ? { ...u, is_banned: true, status: 'banned' } : u
          );
        },
        error: (error) => {
          console.error(`Failed to ban user ${user.id}`, error);
          this.loadingUserId = null;
        }
      });
    }
  }





}
