import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {UserEditPageComponent} from './pages/user-edit-page/user-edit-page.component';
import {UserListPageComponent} from './pages/user-list-page/user-list-page.component';
import {AuthGuard} from '../../core/guards/auth.guard';
import {UpdateUserInfoComponent} from './pages/update-user-info/update-user-info.component';
import {ChangePasswordComponent} from './pages/change-password/change-password.component';
import {ChangeEmailComponent} from './pages/change-email/change-email.component';
import {InfoComponent} from './pages/info/info.component';
import {DeleteAccountComponent} from './pages/delete-account/delete-account.component';
import {RoleGuard} from '../../core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo:"/not-found", pathMatch: 'full' },
  { path: 'list', component: UserListPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },
  {
    path: 'edit',
    component: UserEditPageComponent,
    canActivate: [AuthGuard]
  },
  { path:'update-info',
    component: UpdateUserInfoComponent,
    canActivate: [AuthGuard]
  },
  { path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  { path: 'change-email',
    component: ChangeEmailComponent,
    canActivate: [AuthGuard]
  },
  { path: 'info',
    component: InfoComponent,
    canActivate: [AuthGuard]
  },
  { path: 'delete-account',
    component: DeleteAccountComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
