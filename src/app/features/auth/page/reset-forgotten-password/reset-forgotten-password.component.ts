import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {ButtonName} from '../../../../shared/enums/button-name';

@Component({
  selector: 'app-reset-forgotten-password',
  standalone: false,

  templateUrl: './reset-forgotten-password.component.html',
  styleUrl: './reset-forgotten-password.component.css'
})
export class ResetForgottenPasswordComponent implements OnInit {

  protected resetPassForm!: FormGroup;
  errorMessage: string[] | null = null;
  submitted = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.resetPassForm = this.fb.group({
      otp: ['', Validators.required],
      newPassword: ['', Validators.required],
      verifyPassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = [];

    if (this.resetPassForm.invalid) {
      return;
    }

    this.authService.resetForgottenPassword(this.resetPassForm.value).subscribe({
      next: (response: any) => {
        this.errorMessage = null;
        this.router.navigateByUrl('home').then();
      },
      error: (error: any) => {
        console.log('Error:', error);
          if (error.error?.message) {
          this.errorMessage = [];

          if(Array.isArray(error.error.message)){
            error.error.message.forEach((err: string) => {
              this.errorMessage?.push(err);
            });
          } else {
            this.errorMessage.push(error.error.message);
          }
        }
      }
    })
  }

  protected readonly ButtonName = ButtonName;
}
