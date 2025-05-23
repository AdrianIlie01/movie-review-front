import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirecționare către home

  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path:'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
  { path: 'room', loadChildren: () => import('./features/room/room.module').then(m => m.RoomModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
