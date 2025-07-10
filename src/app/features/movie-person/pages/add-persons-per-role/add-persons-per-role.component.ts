import {Component, OnInit} from '@angular/core';
import {MoviePersonService} from '../../services/movie-person.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';
import {PersonRoles} from '../../../../shared/enums/person-roles';
import {RoomService} from '../../../room/services/room.service';
import {RoomDataInterface} from '../../../../shared/interfaces/room-data.interface';
import {PersonService} from '../../../person/services/person.service';

@Component({
  selector: 'app-add-persons-per-role',
  standalone: false,

  templateUrl: './add-persons-per-role.component.html',
  styleUrl: './add-persons-per-role.component.css'
})
export class AddPersonsPerRoleComponent implements OnInit {

  constructor(
    protected castService: MoviePersonService,
    protected personService: PersonService,
    protected movieService: RoomService,
    protected router: Router,
    protected route: ActivatedRoute,
    private fb: FormBuilder,
  ) {
  }

  protected movieId!: string;
  protected movieName!: string;
  protected formGroup!: FormGroup;
  protected submitted = false;
  protected errorMessage: string[] | null = null;
  protected personOptions!: string[];
  //todo check here - not good displayed

  // protected roleOptions: PersonRoles[] = Object.values(PersonRoles);

  protected roleOptions = Object.entries(PersonRoles).map(([label, value]) => ({
    label,
    value
  }));



  protected readonly ButtonName = ButtonName;

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.movieId = p['movieId'];

      console.log(this.movieId)

    })

    this.personService.getAllPersons().subscribe(d => {
      this.personOptions = d.map((p) => {
        console.log('p')
        console.log(p)
        return p.name
      })
    })

    this.movieService.getRoom(this.movieId).subscribe((room: RoomDataInterface) => {
      this.movieName = room.name;
    });


    this.formGroup = this.fb.group({
      role: ['', Validators.required],
      persons: [[], Validators.required]
    });
  }
  onSubmit() {
    this.submitted = true;
    this.errorMessage = [];

    const role = this.formGroup.get('role')?.value;
    const persons = this.formGroup.get('persons')?.value;

    if (!role?.length) {
      this.errorMessage.push('Please select at least one role.');
    }

    if (!persons?.length) {
      this.errorMessage.push('Please select at least one person.');
    }

    if (this.formGroup.invalid || this.errorMessage.length > 0) {
      return;
    }

    const value = this.formGroup.value;


    const body = {
      role: value.role,
      persons: value.persons
    };

    this.castService.addPersonsToRoleInMovie(this.movieId, value).subscribe({
      next: () => {
        console.log('succesfull added')
        this.router.navigate(['credits/cast', this.movieId]);
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
