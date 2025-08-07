import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {ButtonName} from '../../../../shared/enums/button-name';
import {FormValidatorsService} from '../../../../shared/services/form-validators.service';
@Component({
  selector: 'app-otp-2-fa',
  standalone: false,

  templateUrl: './otp-2-fa.component.html',
  styleUrl: './otp-2-fa.component.css'
})
export class Otp2FaComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  otpForm: FormGroup;
  userId!: string;
  submitted = false;
  errorMessage: string[] | null = null;
  loading!:boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private formValidator: FormValidatorsService,
    private router: Router
  ) {


    this.otpForm = this.fb.group({
      otp: ['', this.formValidator.requiredTrimmed]
    });
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe(
      (data: any) => {
        this.userId = data.id;
      }
    )

    this.otpForm.statusChanges.subscribe(() => {
      if (this.otpForm.touched) {
        this.errorMessage = null;
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit() {
    this.submitted = true;

    if (this.otpForm.invalid) {
      return;
    }

    this.errorMessage = null;

    const id = this.userId
    const otp = this.otpForm.get('otp')?.value;
    this.formValidator.trimAllStringControls(this.otpForm);
    this.loading = true;
    this.authService.verifyOtp(id, otp).subscribe({
      next: (response) => {
        this.router.navigateByUrl('home');
        this.loading = false;
      },
      error: (error) => {
        if (error.error?.message == 'wrong otp') {
          this.errorMessage = ['Invalid OTP code. Please try again!'];
        } else {
          this.errorMessage = ['OTP verification failed.'];
        }
        this.loading = false;
      }
    });
  }


  protected readonly ButtonName = ButtonName;
}
