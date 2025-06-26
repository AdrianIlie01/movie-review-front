import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ButtonName } from '../../../../shared/enums/button-name';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) return;

    this.errorMessage = null;

    this.authService.login(this.registerForm.value).subscribe({
      next: (response: any) => {
        const data = response.access_token_2fa;

        if (data?.otp && data?.access_token) {
          const id = data.user_id;
          this.authService.generateOtp(id);
          this.router.navigateByUrl('auth/login/verify-otp').then();
        } else {
          this.router.navigateByUrl('home').then();
        }
      },
      error: (error) => {
        if (error.error?.message == 'wrong username' || error.error?.message == 'wrong password') {
          this.errorMessage = ['Username or password is incorrect!'];
        } else {
          this.errorMessage = ['Authentication failed.'];
        }
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
