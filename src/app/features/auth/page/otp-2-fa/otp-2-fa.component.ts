import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-otp-2-fa',
  standalone: false,

  templateUrl: './otp-2-fa.component.html',
  styleUrl: './otp-2-fa.component.css'
})
export class Otp2FaComponent implements OnInit {
  otpForm: FormGroup;
  otpSent: boolean = false;
  errorMessage: string | null = null;
  userId!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {


    this.otpForm = this.fb.group({
      otp: [''] // OTP de 6 cifre
    });
  }

  ngOnInit() {
    this.authService.getUserInfo().subscribe(
      (data: any) => {
        this.userId = data.id;
      }
    )
  }

  onSubmit() {
    if (this.otpForm.invalid) {
      return;
    }

    const id = this.userId
    const otp = this.otpForm.get('otp')?.value;

    this.authService.verifyOtp(id, otp).subscribe({
      next: (response) => {
        // Dacă OTP-ul este corect, poți redirecționa utilizatorul
        console.log('OTP verificat cu succes!', response);

        this.router.navigateByUrl('home');
      },
      error: (err) => {
        // Dacă OTP-ul este incorect, afișezi eroarea

        console.log(err);
        this.errorMessage = 'eraore look in log';
      }
    });
  }


}
