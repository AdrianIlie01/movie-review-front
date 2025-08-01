import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MoviePersonService} from '../../services/movie-person.service';
import {ButtonName} from '../../../../shared/enums/button-name';
import {PersonRoles} from '../../../../shared/enums/person-roles';
import {PersonInterface} from '../../../../shared/interfaces/person.interface';
import {RoomService} from '../../../room/services/room.service';

@Component({
  selector: 'app-display-movie-cast',
  standalone: false,

  templateUrl: './display-movie-cast.component.html',
  styleUrl: './display-movie-cast.component.css'
})
export class DisplayMovieCastComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private castService: MoviePersonService,
    private movieService: RoomService
  ) {
  }

  protected movieId!: string;
  protected cast: any[] = [];
  protected groupedCast: Partial<Record<PersonRoles, any[]>> = {};
  protected groupedCastKeys: PersonRoles[] = [];
  protected readonly ButtonName = ButtonName;
  protected movieName!: string;
  protected loading: boolean = true;
  ngOnInit() {
    console.log('init')
    this.route.params.subscribe(params => {
        this.movieId = params['movieId'];

        this.movieService.getRoom(this.movieId).subscribe((d: any) => {
          this.movieName = d.name || 'Movie';
        })

      this.getCast(this.movieId).subscribe({
        next: (data: any) => {
          this.cast = data;
          this.groupCastByRole();
          this.loading = false;
        },
        error: err => {
          this.loading = false;
        }
      });
    });
  }

  getCast(movieId: string) {
    return this.castService.getMovieCast(movieId);
  }
  groupCastByRole() {
    this.groupedCast = this.cast.reduce((acc, curr) => {
      const role = curr.person_role;
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(curr);
      return acc;
    }, {} as { [role: string]: any[] });
    this.groupedCastKeys = Object.keys(this.groupedCast) as PersonRoles[];
  }
  manageCast(role: PersonRoles)  {
    this.router.navigateByUrl(`credits/manage-cast/${this.movieId}/${role}`);
  }

  addPersons() {
    this.router.navigateByUrl(`credits/add-cast/${this.movieId}`);
  }

  personInfo(item: any){
    // this.router.navigateByUrl(`/person/${item.person.id}`);
    this.router.navigateByUrl(`/cast/edit/${item.person.id}`);
  }
}
