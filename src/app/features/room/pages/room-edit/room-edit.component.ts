import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RoomService} from '../../services/room.service';
import {RoomDataInterface} from '../../../../shared/interfaces/room-data.interface';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';
import {MovieTypes} from '../../../../shared/enums/movie-types';

@Component({
  selector: 'app-room-edit',
  standalone: false,

  templateUrl: './room-edit.component.html',
  styleUrl: './room-edit.component.css'
})
export class RoomEditComponent implements OnInit {

  protected roomForm!: FormGroup;
  protected submitted = false;
  protected errorMessage: string[] | null = null;
  protected roomId!: string;
  protected readonly ButtonName = ButtonName;
  protected readonly movieTypes = Object.values(MovieTypes);
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    protected roomService: RoomService,
    private fb: FormBuilder,
  ) {
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.roomId = params['id'];
    });

    this.roomForm = this.fb.group({
      name: ['', {
        validators: [Validators.required],
        asyncValidators:
          [
            this.roomService.validateRoomNameEdit(this.roomId),
          ]
      }],      type: [[], []],
      stream_url: ['', Validators.required],
      release_year: ['', Validators.required],
    });

    if (this.roomId) {
      console.log(this.roomId);
      this.roomService.getRoom(this.roomId).subscribe({
        next: (data: RoomDataInterface) => {
          console.log('data')
          console.log(data)

          this.roomForm.patchValue({
            name: data.name,
            type: data.type ?? [],
            stream_url: data.stream_url,
            release_year: data.release_year
          });
        },
        error: (e) => {
          console.error('Room not found', e);
          this.router.navigateByUrl('/movie/list').then();
        }
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = [];
    this.submitted = true;

    const typeValue = this.roomForm.get('type')?.value;
    if (this.roomForm.invalid || !typeValue || typeValue.length === 0) {
      if (!typeValue || typeValue.length === 0) {
        this.errorMessage = ['Please select at least one movie genre.'];
      }
      return;
    }

    this.roomService.updateRoom(this.roomForm.value, this.roomId).subscribe({
      next: () => {
        // this.router.navigateByUrl('/room/list'),
        console.log('updated')
        this.router.navigateByUrl('movie/list')
      },
      error: (error) => {
        if (Array.isArray(error.error?.message)) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = [error.error?.message || 'An error occurred'];
        }
      }
    });
  }
}
