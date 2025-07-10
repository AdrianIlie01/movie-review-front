import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ManagePersonFilmographyComponent
} from './pages/manage-person-filmography/manage-person-filmography.component';
import {RoleGuard} from '../../core/guards/role.guard';
import {AuthGuard} from '../../core/guards/auth.guard';
import {
  ManageMovieCastComponent
} from './pages/manage-movie-cast/manage-movie-cast.component';
import {DisplayMovieCastComponent} from './pages/display-movie-cast/display-movie-cast.component';
import {
  DisplayPersonFilmographyComponent
} from './pages/display-person-filmography/display-person-filmography.component';
import {AddPersonsPerRoleComponent} from './pages/add-persons-per-role/add-persons-per-role.component';
import {AddRolesForMovieComponent} from './pages/add-roles-for-movie/add-roles-for-movie.component';

const routes: Routes = [


  { path: 'filmography/:personId', component: DisplayPersonFilmographyComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },
  { path: 'manage-movies/:personId/:role', component: ManagePersonFilmographyComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },

  { path: 'add-roles/:personId', component: AddRolesForMovieComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },

  { path: 'cast/:movieId', component: DisplayMovieCastComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },

  { path: 'manage-cast/:movieId/:role', component: ManageMovieCastComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },
  { path: 'add-cast/:movieId', component: AddPersonsPerRoleComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviePersonRoutingModule { }
