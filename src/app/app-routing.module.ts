import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CreateItemComponent } from './items/create-item/create-item.component';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'create-item',
    component: CreateItemComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
