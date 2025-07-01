import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserListInterface} from '../../../../shared/interfaces/user-list.interface';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-list-page',
  standalone: false,

  templateUrl: './user-list-page.component.html',
  styleUrl: './user-list-page.component.css'
})
export class UserListPageComponent implements OnInit {

  constructor(
    protected authService: AuthService,
    protected userService: UserService
  ) {
  }

  protected users!: UserListInterface[];
  protected currentUserId!: string;
  protected loadingUserId: string | null = null;
  ngOnInit() {
    this.authService.isAuthenticated().subscribe((loggedIn) => {
      if (loggedIn) {
        this.userService.getUserInfo().subscribe((user: any) => {
          this.currentUserId = user.id;

          this.userService.getAllUsers().subscribe({
            next: (data) => {
              console.log('Users fetched successfully:');
              console.log(data)
              this.users = data;

              console.log(this.users);

              console.log(Array.isArray(this.users));
            },
            error: (error) => {
              console.error('Error fetching users:', error);
            }
          });
        });
      }
    });


  }

  onRoleChange(user: UserListInterface) {
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

  toggleBanUser(user: UserListInterface): void {
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
