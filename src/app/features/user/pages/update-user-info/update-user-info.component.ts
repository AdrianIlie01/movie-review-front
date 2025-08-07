import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonName} from '../../../../shared/enums/button-name';
import {FormValidatorsService} from '../../../../shared/services/form-validators.service';

@Component({
  selector: 'app-update-user-info',
  standalone: false,

  templateUrl: './update-user-info.component.html',
  styleUrl: './update-user-info.component.css'
})
export class UpdateUserInfoComponent implements OnInit {

  private userInfo!: any
  protected infoForm!: FormGroup;
  protected hasInfo: boolean = false;
  protected readonly ActionButton = ButtonName;
  errorMessage: string[] | null = null;
  submitted = false;

  constructor(
    private userService: UserService,
    protected formValidators: FormValidatorsService,
    private fb: FormBuilder,
    protected router: Router,
  ) {
    this.infoForm = this.fb.group({
      phone: ['', [Validators.required,
        Validators.pattern(/^(?:\+40|0040|0)(7[0-8]\d{7})$/)
      ]],
      person_region: ['', [
        Validators.required,
        this.userService.regionValidator()
      ]]

    })
  }
  ngOnInit() {
    this.userService.getUserInfo().subscribe({
      next: (data: any) => {
        this.userInfo = data;

        this.userService.getInfoOfUser(data.id).subscribe({
          next: (data: any) => {
            // this.infoForm.patchValue({ phone: data.phone });
            if (data.userInfo && data.userInfo.phone) {
              this.hasInfo = true;

              this.infoForm.setValue({ phone: data.userInfo.phone, person_region: data.userInfo.person_region });
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

    if (this.infoForm.invalid) {
      return;
    }
    this.errorMessage = null;


    if (this.hasInfo) {
      this.formValidators.trimAllStringControls(this.infoForm);
      this.userService.editUserInfo(this.infoForm.value, this.userInfo.id).subscribe(
        {
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
        }
      );
      // await this.router.navigateByUrl('home');
      return;
    }

    this.userService.addUserInfo(this.infoForm.value, this.userInfo.id).subscribe({
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


}
