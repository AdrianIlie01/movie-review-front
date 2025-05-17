import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UserEditPageComponent} from './pages/user-edit-page/user-edit-page.component';
import {UserListPageComponent} from './pages/user-list-page/user-list-page.component';
import {AuthGuard} from '../../core/guards/auth.guard';
import {AddUserInfoComponent} from './pages/add-user-info/add-user-info.component';
import {UpdateUserInfoComponent} from './pages/update-user-info/update-user-info.component';

const routes: Routes = [
  { path: '', redirectTo:"/not-found", pathMatch: 'full' },
  {
    path: 'edit',
    component: UserEditPageComponent,
    canActivate: [AuthGuard]
  },
  { path: 'view', component: UserListPageComponent },
  { path:'info',
    component: AddUserInfoComponent,
    canActivate: [AuthGuard]
  },
  { path: 'update-info',
    component: UpdateUserInfoComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
