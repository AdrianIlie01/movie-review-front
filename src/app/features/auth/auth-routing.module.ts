import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from './page/login-page/login-page.component';
import {RegisterPageComponent} from './page/register-page/register-page.component';
import {NonAuthGuard} from '../../core/guards/non-auth.guard';
import {Otp2FaComponent} from './page/otp-2-fa/otp-2-fa.component';

const routes: Routes = [
  {
    path: 'register',
    canActivate: [NonAuthGuard],
    component: RegisterPageComponent
  },
  {
    path: 'login',
    canActivate: [NonAuthGuard],
    component: LoginPageComponent
  },
  {
    path: 'login/verify-otp',
    canActivate: [NonAuthGuard],
    component: Otp2FaComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
