import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MapComponent } from './map/map.component';
import { CreateItemComponent } from './items/create-item/create-item.component';
import { EditItemComponent } from './items/edit-item/edit-item.component';
import { NotificationComponent } from './notification/notification.component';
import { ProfileComponent } from './profile/profile.component';
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
    path: 'edit-item/:itemId',
    component: EditItemComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notification',
    component: NotificationComponent,
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
