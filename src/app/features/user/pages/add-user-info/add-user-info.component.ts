import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-user-info',
  standalone: false,

  templateUrl: './add-user-info.component.html',
  styleUrl: './add-user-info.component.css'
})
export class AddUserInfoComponent implements OnInit {

  private userInfo!: any
  protected infoForm!: FormGroup;
  protected hasInfo: boolean = false;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    protected router: Router,
  ) {
    this.infoForm = this.fb.group({
      phone: ['', [Validators.required,
        Validators.pattern(/^(?:\+40|0040|0)(7[0-8]\d{7})$/)
      ]],
      person_region: ['', [this.userService.regionValidator()]]

    })
  }
  ngOnInit() {
    console.log(this.infoForm); // Verifică dacă formularul este inițializat corect

    this.userService.getUserInfo().subscribe({
      next: (data: any) => {
        this.userInfo = data;

        this.userService.getInfoOfUser(data.id).subscribe({
          next: (data: any) => {
            console.log(data);

            // this.infoForm.patchValue({ phone: data.phone });
            if (data && data.phone) {
              this.hasInfo = true;

              this.infoForm.setValue({ phone: data.phone, person_region: data.person_region });
            }

          },
          error: e => {
            console.log(e)
          }
        })

      }
    })


  }

  async onSubmit() {
    if (this.infoForm.invalid) {
      return;
    }
    if (this.hasInfo) {
      console.log('has')
      console.log('values of form');

      console.log(this.infoForm.value);
      this.userService.editUserInfo(this.infoForm.value, this.userInfo.id).subscribe(
        {
          next: d => {
            console.log(d)
          },
          error: err => {
            console.log(err)
          }
        }
      );
      // await this.router.navigateByUrl('home');
      return;
    }

    this.userService.addUserInfo(this.infoForm.value, this.userInfo.id).subscribe({
      next: (d) => {
        console.log(d)
      },
      error: (e) => {
        console.log(e)
      }
    })
  }


}
