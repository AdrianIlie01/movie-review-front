import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ButtonName } from '../../../../shared/enums/button-name';
import {FormValidatorsService} from '../../../../shared/services/form-validators.service';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  protected registerForm!: FormGroup;
  protected readonly ActionButton = ButtonName;
  errorMessage: string[] | null = null;
  submitted = false;
  loading!:boolean;

  constructor(
    private authService: AuthService,
    private formValidators: FormValidatorsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', this.formValidators.requiredTrimmed],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    this.errorMessage = null;
    this.formValidators.trimSelectedStringControls(this.registerForm, ['username']);
    this.loading = true;
    this.authService.login(this.registerForm.value).subscribe({
      next: (response: any) => {
        const data = response.access_token_2fa;

        if (data?.otp && data?.access_token) {
          const id = data.user_id;
          this.authService.generateOtp(id);
          this.router.navigateByUrl('auth/login/verify-otp').then();
          this.loading = false;
        } else {
          this.router.navigateByUrl('home').then();
          this.loading = false;
        }
      },
      error: (error) => {
        if (error.error?.message == 'wrong username' || error.error?.message == 'wrong password') {
          this.errorMessage = ['Username or password is incorrect!'];
        }
        if (error.error?.message == 'User is banned') {
          this.errorMessage = ['This user profile is banned!'];
        }
        else {
          this.errorMessage = ['Authentication failed.'];
        }
        this.loading = false;
      },
    });
  }

  forgotPassword() {
    this.router.navigateByUrl('auth/forgot-password').then();
  }

  register() {
    this.router.navigateByUrl('auth/register').then();
  }

}
