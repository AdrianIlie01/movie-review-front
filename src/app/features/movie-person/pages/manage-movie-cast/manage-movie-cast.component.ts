import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MoviePersonService} from '../../services/movie-person.service';
import {
  AddPersonsSingleRoleToMovieInterface
} from '../../../../shared/interfaces/add-persons-single-role-to-movie.interface';
import {PersonRoles} from '../../../../shared/enums/person-roles';
import {PersonService} from '../../../person/services/person.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PersonInterface} from '../../../../shared/interfaces/person.interface';
import {ButtonName} from '../../../../shared/enums/button-name';
import {RoomService} from '../../../room/services/room.service';
@Component({
  selector: 'app-manage-movie-cast',
  standalone: false,

  templateUrl: './manage-movie-cast.component.html',
  styleUrl: './manage-movie-cast.component.css'
})
export class ManageMovieCastComponent implements OnInit {

  constructor(
    protected router:Router,
    protected route: ActivatedRoute,
    protected castService: MoviePersonService,
    protected personService: PersonService,
    protected movieService: RoomService,
    private fb: FormBuilder,
  ) {
  }

  protected personForm!: FormGroup;
  protected submitted = false;
  protected movieId!: string;
  protected role!: PersonRoles;
  protected allPersons: PersonInterface[] = [];
  protected personOptions: string[] = [];
  protected selectedPersonNames: string[] = [];
  protected errorMessage: string[] | null = null;
  protected readonly ButtonName = ButtonName;
  protected movieTitle!: string;

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('movieId')!;
    this.role = this.route.snapshot.paramMap.get('role') as PersonRoles;

    this.movieService.getRoom(this.movieId).subscribe((movie) => {
      this.movieTitle = movie.name;
    });

    this.personForm = this.fb.group({
      persons: [[],]
    });

    this.loadData();
  }

  private loadData() {
    this.castService.getMovieCastByRole(this.movieId, this.role).subscribe((cast: any) => {
      // extrage numele persoanelor selectate pentru rolul curent
      this.selectedPersonNames = cast.map((entry: any)=> {
        return entry.person.name
      });

      this.personService.getAllPersons().subscribe((persons: PersonInterface[]) => {
        this.allPersons = persons;

        const allNames = persons.map((p: PersonInterface) => p.name);

        const newOptions = allNames
          .filter((name: string) => {
          return !this.selectedPersonNames.includes(name);
        })
          .sort((a, b) => a.localeCompare(b)); //sort alphabetically in ascending order


        this.personOptions = [...this.selectedPersonNames, ...newOptions];

        // // all persons name but unordered
        // this.personOptions = persons.map((p:any) => {
        //   return p.name
        // });

        // preselectare in formular dupa nume
        this.personForm.patchValue({
          persons: this.selectedPersonNames
        });

      });
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = [];

    // if (this.personForm.invalid || !this.personForm.value.persons.length) {
    if (this.personForm.invalid) {
      // this.errorMessage = ['Please select at least one person.'];
      return;
    }

    const body: AddPersonsSingleRoleToMovieInterface = {
      person: this.personForm.value.persons
    };

    this.castService.managePersonRolesPerMovie(this.movieId, this.role, this.personForm.value).subscribe({
      next: () => {
        this.router.navigate(['credits/cast', this.movieId]);
        // alert('Persons updated successfully!');
      },
      error: (err) => {
        this.errorMessage = [err.error?.message || 'An error occurred'];
      }
    });
  }
}
