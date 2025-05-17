import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActionButton} from '../../../../shared/enums/action-button';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-edit-page',
  standalone: false,

  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.css'
})
export class UserEditPageComponent implements OnInit{
  protected readonly ActionButton = ActionButton;

  protected userInfo!: any;
  protected editForm!: FormGroup;
  constructor(
    protected userService: UserService,
    protected authService: AuthService,
    protected router: Router,
    protected fb: FormBuilder,
  ) {
  }
  ngOnInit() {
    this.editForm = this.fb.group({
      username:['']
    })

    this.getInfo();

  }

  log() {
    console.log('edit yo');
  }

  editUser() {
    console.log('ffff');


    if (this.editForm.invalid) {
      return;
    }

    console.log('?')
    const userId = this.userInfo.id;

    this.userService.editUser(this.editForm.value, userId).subscribe((data) => {
      console.log('data');
      console.log(data);

      this.editForm.get('username')?.setValue('')

      this.router.navigateByUrl('home').then();

    });
  }

  deleteUser() {
    console.log(this.userInfo.id);
    console.log('this.userInfo.id');



    this.authService.logout().subscribe((data) => {
      console.log('logout')
      console.log(data)

      this.userService.deleteUser(this.userInfo.id).subscribe((data) => {
        console.log('data');
        console.log(data);
      })
    });
  }

  getInfo() {
    this.userService.getUserInfo()
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
}
