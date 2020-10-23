import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Item } from './../models/item.model';
import { ItemsService } from './../services/items.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = false;
  items: Item[] = [];
  dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  constructor(private itemService: ItemsService, private router: Router) { }

  ngOnInit(): void {
    this.loading = true;
    this.itemService.getAllItems();
    this.itemService.itemsUpdated.subscribe((itemsData: {items: Item[]}) => {
      this.loading = false;
      this.items = itemsData.items;
    }, erroe => {
      this.loading = false;
    });
  }

  onEditItem(itemId: number) {
    this.router.navigate(['/edit-item', itemId]);
  }

}
