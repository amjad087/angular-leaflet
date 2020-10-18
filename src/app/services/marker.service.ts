import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LatLngExpression } from 'leaflet';

import { Item } from './../models/item.model';
import { MarkerDialogComponent } from './../map/marker-dialog/marker-dialog.component';
import { UserLocation } from './../models/user-location.model';

export class Marker {
  id: number;
  name: string;
  description: string;
  position: LatLngExpression;
}

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(public dialog: MatDialog) { }

  openToolTipDialog(item: Item, pos: UserLocation) {
    this.dialog.open(MarkerDialogComponent, {data: {item}});

  }
}
