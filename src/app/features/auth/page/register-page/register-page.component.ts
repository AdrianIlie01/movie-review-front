import {Component} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';

@Component({
  selector: 'app-register-page',
  standalone: false,

  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {


  protected registerForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string[] | null = null;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
) {
    this.registerForm = this.fb.group({
      username: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators:
          [
            this.authService.validateUsername()
          ],
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
        asyncValidators:
          [
            this.authService.validateEmail()
          ]
      }],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }


  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Register successful', response);
        this.isSubmitting = false;
        this.router.navigateByUrl('home').then()
      },
      error: (error) => {

        if (Array.isArray(error.error?.message)) {

          error.error.message.forEach((err: string) => {
            this.errorMessage?.push(err);
          });
        } else {
          this.errorMessage = error.error?.message || 'Registration failed';
        }


        if ( typeof error.error?.message == "string" && error.error?.message.includes('Duplicate entry')) {
          this.errorMessage = [];
          // this.errorMessage[0] = error.error?.message;
          this.errorMessage[0] = 'Duplicate entry. Please try again with a different username or email.';
        }
        this.isSubmitting = false;
      },
    });
  }

  protected readonly ButtonName = ButtonName;
}
