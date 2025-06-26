import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import {UserEditPageComponent} from './pages/user-edit-page/user-edit-page.component';
import {UserListPageComponent} from './pages/user-list-page/user-list-page.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from '../../shared/shared.module';
import { UpdateUserInfoComponent } from './pages/update-user-info/update-user-info.component';
import {ChangeEmailComponent} from './pages/change-email/change-email.component';
import {ChangePasswordComponent} from './pages/change-password/change-password.component';
import {FormComponent} from '../../shared/components/form/form.component';
import {FormInputComponent} from '../../shared/components/form-input/form-input.component';
import { InfoComponent } from './pages/info/info.component';

@NgModule({
  declarations: [
    UserEditPageComponent,
    UserListPageComponent,
    UpdateUserInfoComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormComponent,
    FormInputComponent
  ]
})
export class UserModule { }
