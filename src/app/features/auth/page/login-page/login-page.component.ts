import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: false,

  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  protected registerForm!: FormGroup;
  errorMessage: string[] | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = null;

    this.authService.login(this.registerForm.value).subscribe({
      next: (response: any) => {
        console.log('response');
        console.log(response);


        const data = response.access_token_2fa;

        console.log(data?.otp);
        console.log(data?.access_token);

        if (data?.otp && data?.access_token) {
          const token = data.access_token;

          // const decodedToken: any = jwt_decode(token); // Decodifică token-ul

          // const id = decodedToken.id;
          const id = data.user_id;

          this.authService.generateOtp(id);

          this.router.navigateByUrl('auth/login/verify-otp').then();

        } else {
          console.log('login successful - else', response);
          this.router.navigateByUrl('home').then();
        }
      },
      error: (error) => {
        console.log('error')
        console.log(error);
        console.log(error.error);
        console.log(error.error?.message);
      },
    });
  }

}

