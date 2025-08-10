import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './page/login-page/login-page.component';
import { RegisterPageComponent } from './page/register-page/register-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {Otp2FaComponent} from './page/otp-2-fa/otp-2-fa.component';
import { ForgotPasswordComponent } from './page/forgot-password/forgot-password.component';
import { ResetForgottenPasswordComponent } from './page/reset-forgotten-password/reset-forgotten-password.component';
import {SharedModule} from "../../shared/shared.module";
import {FormComponent} from '../../shared/components/form/form.component';
import {FormInputComponent} from '../../shared/components/form-input/form-input.component';
import { TwoFactorAuthComponent } from './page/two-factor-auth/two-factor-auth.component';
import { TestAccountsComponent } from './components/test-accounts/test-accounts.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    RegisterPageComponent,
    Otp2FaComponent,
    ForgotPasswordComponent,
    ResetForgottenPasswordComponent,
    TwoFactorAuthComponent,
    TestAccountsComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormComponent,
    FormInputComponent
  ],
})
export class AuthModule { }
