import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirecționare către home

  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path:'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
  { path: 'movie', loadChildren: () => import('./features/room/room.module').then(m => m.RoomModule) },
  { path: 'cast', loadChildren: () => import('./features/person/person.module').then(m => m.PersonModule) },
  { path: 'credits', loadChildren: () => import('./features/movie-person/movie-person.module').then(m => m.MoviePersonModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled',   // Scrolls to top of the page on route change
    anchorScrolling: 'enabled',             // Enables scrolling to anchor (#) links
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
