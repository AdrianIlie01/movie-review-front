import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeHeaderComponent } from './components/home-header/home-header.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MovieCarouselComponent } from './components/movie-carousel/movie-carousel.component';
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { CastAndMovieCarouselComponent } from './components/cast-and-movie-carousel/cast-and-movie-carousel.component';
import { TopMoviesCarouselComponent } from './components/top-movies-carousel/top-movies-carousel.component';
import { TopCastCarouselComponent } from './components/top-cast-carousel/top-cast-carousel.component';

@NgModule({
    declarations: [
        HomePageComponent,
        HomeHeaderComponent,
        MovieCarouselComponent,
        CastAndMovieCarouselComponent,
        TopMoviesCarouselComponent,
        TopCastCarouselComponent
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
