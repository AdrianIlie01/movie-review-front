import {Component, OnInit} from '@angular/core';
import {MoviePersonService} from '../../services/movie-person.service';
import {PersonService} from '../../../person/services/person.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PersonRoles} from '../../../../shared/enums/person-roles';
import {ButtonName} from '../../../../shared/enums/button-name';
import {RoomService} from '../../../room/services/room.service';

@Component({
  selector: 'app-add-roles-for-movie',
  standalone: false,

  templateUrl: './add-roles-for-movie.component.html',
  styleUrl: './add-roles-for-movie.component.css'
})
export class AddRolesForMovieComponent implements OnInit {

  constructor(
    protected castService: MoviePersonService,
    protected personService: PersonService,
    protected movieService: RoomService,
    protected router: Router,
    protected route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
  }

  protected personId!: string;
  protected formGroup!: FormGroup;
  protected submitted = false;
  protected errorMessage: string[] | null = null;
  protected moviesOptions!: string[];
  protected personName!: string;

  protected readonly roleOptions = Object.values(PersonRoles);

  // protected roleOptions = Object.entries(PersonRoles).map(([label, value]) => ({
  //   label,
  //   value
  // }));

//todo select multiple: false - ma lasa sa selectez mai multe variante, odata ce il deschid din nou si selectez una noua la a 3 incercare
// selecteaza toate numele ce incep asemanator cu cel selectat

  protected readonly ButtonName = ButtonName;

  ngOnInit() {

    this.route.params.subscribe((p) => {
      this.personId = p['personId'];
    })

    this.movieService.getAllRooms().subscribe((rooms) => {
      this.moviesOptions = rooms.map((room) => {
        return room.name;
      })
    });

    this.personService.getPerson(this.personId).subscribe((person) => {
      this.personName = person.name;
    });

    this.formGroup = this.fb.group({
      roles: [[], Validators.required],
      movie: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = [];

    const roles = this.formGroup.get('roles')?.value;
    const movie = this.formGroup.get('movie')?.value;

    if (!roles?.length) {
      this.errorMessage.push('Please select at least one role.');
    }

    if (!movie?.length) {
      this.errorMessage.push('Please select a movie.');
    }

    if (this.formGroup.invalid || this.errorMessage.length > 0) {
      return;
    }

    const value = this.formGroup.value;


    const body = {
      roles: value.roles,
      movie: value.movie
    };

    console.log('id');
    console.log(this.personId);

    this.castService.addPersonRolesToMovie(this.personId, value).subscribe({
      next: () => {
        console.log('succesfull added')
        this.router.navigate(['credits/filmography', this.personId]);
      },
      error: (err) => {
        if (Array.isArray(err.error?.message)) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = [err.error?.message || 'An error occurred'];
        }
      }
    });

  }

}
