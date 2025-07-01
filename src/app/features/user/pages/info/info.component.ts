import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';

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

  protected user!: any;
  protected userInfo!: any;
  protected hasInfo: boolean = false;

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res: any) => {

      console.log('res');
      console.log(res);
      console.log(res.id);

      this.userService.getInfoOfUser(res.id).subscribe((info: any) => {
        console.log('user info')

        if (info.user == null) {
          return;
        }

        this.user = info.user;

        if (info.userInfo == null) {
          console.log('no info for user');
          return;
        }
        this.hasInfo = true;
        this.userInfo = info.userInfo;
        console.log('info');
        console.log(info);
      })
    })
  }

  // info: username, email, phone, person_region, 2fa_active, role

}
