import {Component, OnInit} from '@angular/core';
import {RoomService} from '../../services/room.service';
import {AuthService} from '../../../../core/services/auth.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';
import {MovieTypes} from '../../../../shared/enums/movie-types';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-room-page',
  standalone: false,

  templateUrl: './add-room-page.component.html',
  styleUrl: './add-room-page.component.css'
})
export class AddRoomPageComponent implements OnInit {
  protected userInfo!: any;
  protected readonly ButtonName = ButtonName;
  protected readonly MovieTypes = MovieTypes;

  selectedFile!: File | null;
  roomName!: string;

  constructor(
    protected router: Router,
    protected roomService: RoomService,
    protected authService: AuthService,
    private fb: FormBuilder,

  ) {
    this.movieForm = this.fb.group({
      name: ['', {
        validators: [Validators.required],
        asyncValidators:
          [
            this.roomService.validateRoomName()
          ],
        updateOn: 'blur'
      }],
      type: [[], [
        // Validators.required,
      ]],
      stream_url: ['', Validators.required],
      release_year: ['', Validators.required],
    })
  }

  protected movieForm!: FormGroup;
  protected readonly ActionButton = ButtonName;
  protected errorMessage: string[] | null = null;
  protected submitted = false;
  protected movieTypes = Object.values(MovieTypes);

  ngOnInit() {
    this.getUserInfo();
  }



  getUserInfo() {
    this.authService.getUserInfo()
      .subscribe({
        next: (data) => {
          console.log('data');
          console.log(data);

          this.userInfo = data;
        },
        error: (e) => {
          console.error('Eroare:', e);
        }
      });
  }

  onSubmit(): void {
    this.errorMessage = [];
    const typeValue = this.movieForm.get('type')?.value;
    this.submitted = true;

    if (this.movieForm.invalid) {
      if (typeValue.length <= 0) {
        this.errorMessage = ['Please select at least one movie type.']
        return;
      }
      return;
    }

    if (typeValue.length <= 0) {
      this.errorMessage = ['Please select at least one movie type.'];
      return;
    } else  {
      this.errorMessage = [];
    }

    this.roomService.addMovie(this.movieForm.value).subscribe({
      next: (res) => {
        console.log('succesfullly added movie');``
        console.log(this.movieForm.value);
        this.router.navigateByUrl('home').then();
      },
      error: (error) => {
        console.log(error);

      if (Array.isArray(error.error?.message) && error.error?.message.length > 0) {
        error.error.message.forEach((e: string) => {
          this.errorMessage?.push(e)
        })
      } else {
        console.log(error.error.message)
        this.errorMessage = [error.error.message];
      }
    }
    })

  }

}
