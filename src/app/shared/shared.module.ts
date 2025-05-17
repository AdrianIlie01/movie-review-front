import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';



@NgModule({
  declarations: [
    HeaderComponent,
    SideMenuComponent,
    PaymentFormComponent,
    ActionButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ActionButtonComponent
  ]
})
export class SharedModule { }
