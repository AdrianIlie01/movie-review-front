import {Component} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
) {
    this.registerForm = this.fb.group({
      username: [''],
      email: ['', {
        asyncValidators:
          [
            this.authService.validateEmail()
          ]
      }],
      password: [''],
    //   username: ['', [Validators.required, Validators.minLength(3)]],
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }


  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Register successful', response);
        this.isSubmitting = false;
      },
      error: (error) => {

        if (Array.isArray(error.error?.message)) {
          this.errorMessage = error.error?.message || 'Registration failed';
        }

        if ( typeof error.error?.message == "string" && error.error?.message.includes('Duplicate entry')) {
          this.errorMessage = [];
          // this.errorMessage[0] = error.error?.message;
          this.errorMessage[0] = 'Date duplicate, deja exista in baza de date';
        }
        this.isSubmitting = false;
      },
    });
  }

}
