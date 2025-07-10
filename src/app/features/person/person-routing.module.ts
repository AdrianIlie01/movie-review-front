import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../../core/guards/auth.guard';
import {RoleGuard} from '../../core/guards/role.guard';
import {EditPersonComponent} from './pages/edit-person/edit-person.component';
import {AddPersonComponent} from './pages/add-person/add-person.component';
import {PersonListComponent} from './pages/person-list/person-list.component';
import {PersonPageComponent} from './pages/person-page/person-page.component';

const routes: Routes = [

  { path: 'list', component: PersonListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },
  { path: 'add', component: AddPersonComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },
  { path: ':id', component: PersonPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'edit/:id', component: EditPersonComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule { }
