import { Component, OnInit, Input } from '@angular/core';

import { Item } from './../../models/item.model';

@Component({
  selector: 'app-marker-dialog',
  templateUrl: './marker-dialog.component.html',
  styleUrls: ['./marker-dialog.component.css']
})
export class MarkerDialogComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit(): void {
  }

}
