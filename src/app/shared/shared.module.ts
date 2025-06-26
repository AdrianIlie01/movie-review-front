import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import {NavigationMenuComponent} from './components/navigation-menu/navigation-menu.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    HeaderComponent,
    PaymentFormComponent,
    ActionButtonComponent,
    NavigationMenuComponent,
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
  exports: [
    ActionButtonComponent,
    NavigationMenuComponent
  ]
})
export class SharedModule { }
