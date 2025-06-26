import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {ButtonName} from '../../../../shared/enums/button-name';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {


    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
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

    this.authService.verifyOtp(id, otp).subscribe({
      next: (response) => {
        // Dacă OTP-ul este corect, poți redirecționa utilizatorul
        console.log('OTP verificat cu succes!', response);

        this.router.navigateByUrl('home');
      },
      error: (error) => {
        if (error.error?.message == 'wrong otp') {
          this.errorMessage = ['Invalid OTP code. Please try again!'];
        } else {
          this.errorMessage = ['OTP verification failed.'];
        }
      }
    });
  }


  protected readonly ButtonName = ButtonName;
}
