import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-change-password',
  standalone: false,

  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit{

  protected errorMessage: string[] | null = null;
  protected submitted = false;
  protected passwordForm!: FormGroup;
  protected readonly ButtonName = ButtonName;
  protected userId!: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      verifyPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res: any) => {
      this.userId = res.id
    })
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = [];

    if (this.passwordForm.invalid) {
      return;
    }

    this.userService.changePassword(this.passwordForm.value, this.userId).subscribe({
      next: (response: any) => {
        this.errorMessage = null;
        this.router.navigateByUrl('home').then();
      },
      error: (error: any) => {
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

}
