import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ButtonName} from '../../../../shared/enums/button-name';

@Component({
  selector: 'app-delete-account',
  standalone: false,

  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.css'
})
export class DeleteAccountComponent implements OnInit {

  private userInfo!: any
  protected deleteForm!: FormGroup;
  protected hasInfo: boolean = false;
  protected readonly ActionButton = ButtonName;
  errorMessage: string[] | null = null;
  submitted = false;
  constructor(
    protected userService: UserService,
    private fb: FormBuilder,
    protected router: Router,
  ) {
    this.deleteForm = this.fb.group({
      confirmation: [''],
      // confirmation: ['', [Validators.required]],
    })
  }
  ngOnInit() {

    this.userService.getUserInfo().subscribe({
      next: (data: any) => {
        this.userInfo = data;
        console.log('data');
        console.log(data);
      }
    })

  }

  async onSubmit() {
    this.submitted = true;

    if (this.deleteForm.invalid) {
      return;
    }
    this.errorMessage = null;

    if (this.deleteForm.value.confirmation !== 'DELETE') {
      this.errorMessage = ['Please type DELETE in all caps to confirm account deletion!'];
      return;
    }

    this.userService.deleteUser(this.userInfo.id).subscribe({
      next: d => {
        this.router.navigateByUrl('home').then();
      },
      error: (error) => {
        console.log(error)
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
