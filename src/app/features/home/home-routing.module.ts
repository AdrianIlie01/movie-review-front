import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {AuthGuard} from '../../core/guards/auth.guard';

const routes: Routes = [
  // /*here or in app-routing.module*/  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirecționare către home
  { path: 'home', component: HomePageComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
