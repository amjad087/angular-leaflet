import { Injectable } from '@angular/core';

import { Item } from './item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  items: Item[] = [
    { subject: 'Title1', body: 'test body1', createdBy: 'Amjad',  createdDate: '20m', location: 'Islamabad'},
    { subject: 'Title2', body: 'test body2', createdBy: 'Amjad',  createdDate: '20m', location: 'Islamabad'},
    { subject: 'Title3', body: 'test body3', createdBy: 'Amjad',  createdDate: '20m', location: 'Islamabad'},
    { subject: 'Title4', body: 'test body4', createdBy: 'Amjad',  createdDate: '20m', location: 'Islamabad'},
  ];
  constructor() { }

  getItems() {
    return this.items;
  }
}
