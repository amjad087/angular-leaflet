import { DbItem } from './../models/db-item.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { Item } from '../models/item.model';
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

    this.http.get<{items: DbItem[]}>(this.apiUrl).subscribe(res => {
      // console.log(res.items[0].loc.coordinates[0] + ' ' + res.items[0].loc.coordinates[1] );

      // this.getAddressFromLatLong(res.items[0].loc.coordinates[0], res.items[0].loc.coordinates[1]).subscribe(res => {
      //   console.log(res);
      // });

    });
    return this.items;

  }

  getAddressFromLatLong(lat: number, lng: number) {
    const params = new HttpParams().set('format', 'jsonv2').set('lat', lat.toString()).set('lon', lng.toString());
    return this.http.get<{address: any}>('https://nominatim.openstreetmap.org/reverse', { params });
  }

  getLatlongFromAddress(address: string) {

    this.http.get('https://nominatim.openstreetmap.org/search?format=json&q=' + address).subscribe(res => {
      console.log(res);
    });
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
