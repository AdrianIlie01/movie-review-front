import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import {UserEditPageComponent} from './pages/user-edit-page/user-edit-page.component';
import {UserListPageComponent} from './pages/user-list-page/user-list-page.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from '../../shared/shared.module';
import { AddUserInfoComponent } from './pages/add-user-info/add-user-info.component';
import { UpdateUserInfoComponent } from './pages/update-user-info/update-user-info.component';
@NgModule({
  declarations: [
    UserEditPageComponent,
    UserListPageComponent,
    AddUserInfoComponent,
    UpdateUserInfoComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserModule { }
