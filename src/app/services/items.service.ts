import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { Item } from '../items/item.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  apiUrl = environment.backendUrl + 'items/'; // items api end points

  items: Item[] = [
    { subject: 'Title1', body: 'test body1', createdBy: 'Amjad',  createdDate: '20m', location: 'Islamabad'},
    { subject: 'Title2', body: 'test body2', createdBy: 'Amjad',  createdDate: '20m', location: 'Islamabad'},
    { subject: 'Title3', body: 'test body3', createdBy: 'Amjad',  createdDate: '20m', location: 'Islamabad'},
    { subject: 'Title4', body: 'test body4', createdBy: 'Amjad',  createdDate: '20m', location: 'Islamabad'},
  ];
  constructor(private http: HttpClient, private authService: AuthService) { }

  getItems() {
    return this.items;
  }

  createItem() {
    const userid = this.authService.getUserId();
    const item = {
      subject: 'Title1',
      body: 'Test Body',
      category: 'A'
    };
    this.http.post(this.apiUrl + 'create', item).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    });
  }
}
