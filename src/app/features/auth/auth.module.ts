import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {Otp2FaComponent} from './page/otp-2-fa/otp-2-fa.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    RegisterPageComponent,
    Otp2FaComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ],
})
export class AuthModule { }
