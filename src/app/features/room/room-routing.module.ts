import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddRoomPageComponent} from './pages/add-room-page/add-room-page.component';
import {RoomPageComponent} from './pages/room-page/room-page.component';
import {ListRoomPageComponent} from './pages/list-room-page/list-room-page.component';
import {RoleGuard} from '../../core/guards/role.guard';
import {AuthGuard} from '../../core/guards/auth.guard';
import {RoomEditComponent} from './pages/room-edit/room-edit.component';
// import {AuthResolver} from '../../core/resolvers/auth.resolver';

const routes: Routes = [
  { path: '', redirectTo:"/not-found", pathMatch: 'full' },

  { path: 'list', component: ListRoomPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },
  {
    path: 'add',
    component: AddRoomPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: ['admin']}
  },
  { path: ':id', component: RoomPageComponent, canActivate: [AuthGuard] },

  { path: 'edit/:id', component: RoomEditComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {roles: 'admin'}
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomRoutingModule { }
