import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';
import {FormValidatorsService} from '../../../../shared/services/form-validators.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,

  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {

  protected identifierForm!: FormGroup;
  errorMessage: string[] | null = null;
  submitted = false;
  constructor(
    private authService: AuthService,
    private formValidatorsService: FormValidatorsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.identifierForm = this.fb.group({
      userIdentifier: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Initialization logic can go here
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.identifierForm.invalid) {
      return;
    }
    this.formValidatorsService.trimAllStringControls(this.identifierForm);
    this.authService.sendUserIdentifier(this.identifierForm.value).subscribe({
      next: (response: any) => {
        this.errorMessage = null;
        this.router.navigateByUrl('auth/reset-forgotten-password').then();
      },
      error: (error: any) => {
        if (error.error?.message == 'user not found') {
          this.errorMessage = ['Invalid identifier: user does not exist!'];
        }
      }
    })
  }

  protected readonly ButtonName = ButtonName;
}
