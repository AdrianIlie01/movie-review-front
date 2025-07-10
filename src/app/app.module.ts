import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {FeaturesModule} from './features/features.module';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {RefreshTokenInterceptor} from './core/interceptors/refresh-token.interceptor';
import {SharedModule} from './shared/shared.module';
import { PersonModule } from './features/person/person.module';
import { MoviePersonModule } from './features/movie-person/movie-person.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FeaturesModule,
    SharedModule,
    PersonModule,
    MoviePersonModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
