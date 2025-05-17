import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeModule} from './home/home.module';
import {NotFoundModule} from './not-found/not-found.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HomeModule,
    NotFoundModule,
  ],
})
export class FeaturesModule { }
