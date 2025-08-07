import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {ButtonName} from '../../../../shared/enums/button-name';
import {FormValidatorsService} from '../../../../shared/services/form-validators.service';

@Component({
  selector: 'app-change-email',
  standalone: false,

  templateUrl: './change-email.component.html',
  styleUrl: './change-email.component.css'
})
export class ChangeEmailComponent implements OnInit{

  constructor(
    private authService: AuthService,
    protected userService: UserService,
    protected formValidators: FormValidatorsService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.emailForm = this.fb.group({
      otp: ['', this.formValidators.requiredTrimmed],
      email: ['', {
        validators: [this.formValidators.requiredTrimmed, Validators.email],
        asyncValidators:
          [
            this.authService.validateEmail()
          ]
      }],
    });
  }
  protected emailForm!: FormGroup;
  protected userId!: string;
  protected readonly ButtonName = ButtonName;
  protected errorMessage: string[] | null = null;
  protected submitted = false;

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res: any) => {
      this.userId = res.id;
      this.userService.sendOtpResetEmail(res.id).subscribe();
    });
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.emailForm.invalid) {
      return;
    }

    this.errorMessage = null;
    this.formValidators.trimAllStringControls(this.emailForm);
    this.userService.changeEmail(this.emailForm.value, this.userId).subscribe({
      next: (response) => {
        this.router.navigateByUrl('home').then()
      },
      error: (error) => {

        if (Array.isArray(error.error?.message)) {
          error.error.message.forEach((err: string) => {
            this.errorMessage?.push(err);
          });
        } else {
          this.errorMessage = [error.error?.message || 'Changing email failed.'];
        }
        },
    });
  }


}
