import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Item } from './../../models/item.model';

@Component({
  selector: 'app-marker-dialog',
  templateUrl: './marker-dialog.component.html',
  styleUrls: ['./marker-dialog.component.css']
})
export class MarkerDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { item: Item }) { }

  ngOnInit(): void {
  }

}
