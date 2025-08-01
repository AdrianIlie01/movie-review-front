import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import {NavigationMenuComponent} from './components/navigation-menu/navigation-menu.component';
import {ReactiveFormsModule} from "@angular/forms";
import { FormSelectComponent } from './components/form-select/form-select.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { RatingComponent } from './components/rating/rating.component';
import { RedirectLoaderComponent } from './components/redirect-loader/redirect-loader.component';
import { RatingColorPipe } from './pipes/rating-color.pipe';



@NgModule({
  declarations: [
    HeaderComponent,
    PaymentFormComponent,
    ActionButtonComponent,
    NavigationMenuComponent,
    FormSelectComponent,
    SafeUrlPipe,
    RatingComponent,
    RedirectLoaderComponent,
    RatingColorPipe,
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
    ],
    exports: [
        ActionButtonComponent,
        NavigationMenuComponent,
        FormSelectComponent,
        SafeUrlPipe,
        RatingComponent,
        RedirectLoaderComponent,
        RatingColorPipe
    ]
})
export class SharedModule { }
