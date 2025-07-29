import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MovieCarouselComponent } from './components/movie-carousel/movie-carousel.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { CastAndMovieCarouselComponent } from './components/cast-and-movie-carousel/cast-and-movie-carousel.component';

@NgModule({
  declarations: [
    HomePageComponent,
    HomeHeaderComponent,
    MovieCarouselComponent,
    SearchFilterComponent,
    CastAndMovieCarouselComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
})
export class HomeModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
