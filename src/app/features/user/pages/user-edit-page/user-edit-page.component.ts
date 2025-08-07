import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';
import {FormValidatorsService} from '../../../../shared/services/form-validators.service';

@Component({
  selector: 'app-user-edit-page',
  standalone: false,

  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.css'
})
export class UserEditPageComponent implements OnInit{
  protected readonly ActionButton = ButtonName;

  protected userInfo!: any;
  protected editForm!: FormGroup;
  protected submitted = false;
  errorMessage: string[] | null = null;

  constructor(
    protected userService: UserService,
    protected authService: AuthService,
    protected formValidators: FormValidatorsService,
    protected router: Router,
    protected fb: FormBuilder,
  ) {
    this.editForm = this.fb.group({
      username: ['', {
        validators: [this.formValidators.requiredTrimmed, Validators.minLength(3)],
        // asyncValidators:
        //   [
        //     this.authService.validateUsername()
        //   ],
      }],    })
  }
  ngOnInit() {

    this.userService.getUserInfo()
      .subscribe({
        next: (data: any) => {
          this.userInfo = data;
          this.editForm.get('username')?.setValue(data.username);

          this.editForm.get('username')?.setAsyncValidators(this.authService.validateUsernameLoggedIn(data.username));
        },
        error: (e) => {
          console.error('Error:', e);
        }
      });
  }


  onSubmit() {
    this.submitted = true;
    this.errorMessage = [];


    if (this.editForm.invalid) {
      return;
    }

    const userId = this.userInfo.id;

    if (this.editForm.get('username')?.value === this.userInfo.username) {
     return this.router.navigateByUrl('home').then();
    }
    this.formValidators.trimAllStringControls(this.editForm);
    this.userService.editUser(this.editForm.value, userId).subscribe({
      next: (data) => {
        this.errorMessage = null;
        this.editForm.get('username')?.setValue('')
        this.router.navigateByUrl('home').then();
      },
      error: (error) => {
        this.errorMessage = [];

        if(Array.isArray(error.error.message)){
          error.error.message.forEach((err: string) => {
            this.errorMessage?.push(err);
          });
        } else {
          this.errorMessage.push(error.error.message);
        }      }
    });

    return;
  }

  getInfo() {
    this.userService.getUserInfo()
      .subscribe({
        next: (data) => {
          this.userInfo = data;
        },
        error: (e) => {
          console.error('Error:', e);
        }
      });
  }

  protected readonly ButtonName = ButtonName;
}
