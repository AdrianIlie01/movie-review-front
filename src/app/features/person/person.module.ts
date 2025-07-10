import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';
import { AddPersonComponent } from './pages/add-person/add-person.component';
import { PersonListComponent } from './pages/person-list/person-list.component';
import { EditPersonComponent } from './pages/edit-person/edit-person.component';
import {FormComponent} from '../../shared/components/form/form.component';
import {FormInputComponent} from '../../shared/components/form-input/form-input.component';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import { PersonPageComponent } from './pages/person-page/person-page.component';


@NgModule({
  declarations: [
    AddPersonComponent,
    PersonListComponent,
    EditPersonComponent,
    PersonPageComponent
  ],
  imports: [
    CommonModule,
    PersonRoutingModule,
    FormComponent,
    FormInputComponent,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class PersonModule { }
