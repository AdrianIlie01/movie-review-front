import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';


@NgModule({
  declarations: [
    NotFoundComponent,
    NotFoundPageComponent,
  ],
  imports: [
    CommonModule,
    NotFoundRoutingModule
  ],
  exports: [
    NotFoundPageComponent
  ]
})
export class NotFoundModule { }
