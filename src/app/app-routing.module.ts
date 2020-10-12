import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';

import { CreateItemComponent } from './items/create-item/create-item.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-item',
    component: CreateItemComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
