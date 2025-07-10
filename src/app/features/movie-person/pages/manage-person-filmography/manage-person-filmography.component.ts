import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MoviePersonService} from '../../services/movie-person.service';
import {RoomService} from '../../../room/services/room.service';
import {PersonRoles} from '../../../../shared/enums/person-roles';
import {
  AddRolesPersonForSingleMovieInterface
} from '../../../../shared/interfaces/add-roles-person-for-single-movie.interface';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';

interface Movie {
  id: string;
  name: string;
}

@Component({
  selector: 'app-manage-person-filmography',
  standalone: false,

  templateUrl: './manage-person-filmography.component.html',
  styleUrl: './manage-person-filmography.component.css'
})
export class ManagePersonFilmographyComponent implements OnInit {

  protected personForm!: FormGroup;
  protected submitted = false;
  protected errorMessage: string[] | null = null;

  protected personId!: string;
  protected role!: PersonRoles;
  protected movieOptions: string[] = [];
  protected selectedMovieNames: string[] = [];
  protected personName = '';
  protected readonly ButtonName = ButtonName;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private castService: MoviePersonService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('personId')!;
    this.role = this.route.snapshot.paramMap.get('role') as PersonRoles;

    this.personForm = this.fb.group({
      movies: [[]]
    });

    this.loadData();
  }

  private loadData(): void {
    // 1. filmele deja asociate cu acest rol
    this.castService.getMoviesByPersonRole(this.personId, this.role).subscribe((data: any) => {
      this.selectedMovieNames = data.map((item: any) => item.room.name);
      this.personName = data[0]?.person?.name ?? 'Unknown';

      // 2. toate filmele disponibile
      this.roomService.getAllRooms().subscribe((rooms: any[]) => {

        const allOptions = rooms.map(room => room.name);

        const newOptions = allOptions
          .filter(n => {return !this.selectedMovieNames.includes(n)})
          .sort((a, b) => a.localeCompare(b)); //sort alphabetically in ascending order

        // this.movieOptions = rooms.map(room => room.name);
        this.movieOptions = [...this.selectedMovieNames, ...newOptions];

        // preselectăm valorile deja bifate
        this.personForm.patchValue({
          movies: this.selectedMovieNames
        });

      });
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = [];

    if (this.personForm.invalid) {
      return;
    }

    this.castService.managePersonMoviesPerRole(this.personId, this.role, this.personForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl(`credits/filmography/${this.personId}`);
      },
      error: (err) => {
        this.errorMessage = [err.error?.message || 'An error occurred'];
      }
    });
  }
}
