import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserInterface} from '../../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-info',
  standalone: false,

  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit{

  constructor(
    protected userService: UserService,
  ) {
  }

  protected user: UserInterface = {
    id: '',
    email: '',
    email_verified_at: '',
    username:  '',
    role: '',
    status: '',
    is_2_fa_active: false,
    create_date: '',
    update_date: ''
  };
  protected userInfo!: any;
  protected hasInfo: boolean = false;
  protected loading: boolean = true;

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res: any) => {

      this.userService.getInfoOfUser(res.id).subscribe({
        next: (info: any) => {
          this.loading = false;

          if (info.user == null) {
            this.user.username = res.username;
            this.user.role = res.roles;
            return;
          }

          this.user = info.user;

          if (info.userInfo == null) {
            return;
          }
          this.hasInfo = true;
          this.userInfo = info.userInfo;
        },
        error: (err) => {
          this.user.username = res.username;
          this.user.role = res.roles;
          this.loading = false;
        }
      })
    })
  }

  // info: username, email, phone, person_region, 2fa_active, role

}
