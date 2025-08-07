import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';
import {UserService} from '../../../user/services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/auth.service';

@Component({
  selector: 'app-two-factor-auth',
  standalone: false,

  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.css'
})
export class TwoFactorAuthComponent implements  OnInit {

  protected _2fa_enabled: boolean = false;
  protected readonly ButtonName = ButtonName;
  private userId!: string;
  protected _2faForm!: FormGroup;
  protected readonly ActionButton = ButtonName;
  errorMessage: string[] | null = null;
  submitted = false;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    protected router: Router,
  ) {
    this._2faForm = this.fb.group({
      confirmation: [''],
    })
  }

  ngOnInit() {
    this.userService.getUserInfo().subscribe({
      next: (data: any) => {

        this.userService.getInfoOfUser(data.id).subscribe({
          next: (data: any) => {
            this.userId = data.user.id
            if (data.user.is_2_fa_active) {
              this._2fa_enabled = true;
            }
          },
          error: e => {
          }
        })

      }
    })


  }

  async onSubmit() {
    this.submitted = true;

    if (this._2faForm.invalid) {
      return;
    }
    this.errorMessage = null;

    if (this._2fa_enabled && this._2faForm.value.confirmation.trim() !== 'DISABLE') {
      this.errorMessage = ['Please type DISABLE in all caps!'];
      return;
    }

    if (!this._2fa_enabled && this._2faForm.value.confirmation.trim() !== 'ENABLE') {
      this.errorMessage = ['Please type ENABLE in all caps!'];
      return;
    }

    this.userService.enableDisable2Fa(this.userId).subscribe({
      next: d => {
        this.router.navigateByUrl('home').then();
      },
      error: (error) => {
        if (error.error?.message.length > 0) {
          error.error.message.forEach((e: string) => {
            this.errorMessage?.push(e)
          })
        } else {
          this.errorMessage = error.error.message;
        }
      }
    })
  }

  disablePaste(event: ClipboardEvent): void {
    event.preventDefault();
  }
}
