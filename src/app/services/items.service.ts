import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { UserLocation } from './../models/user-location.model';
import { LocationService } from './location.service';
import { Item } from '../models/item.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  apiUrl = environment.backendUrl + 'items/'; // items api end points

  items: Item[] = [];
  itemsUpdated = new Subject<{items: Item[]}>(); // will be emited on items change
  constructor(
    private http: HttpClient,
    private locService: LocationService,
    private router: Router
  ) { }

  // ------------------------------------------------------------------------
  // Get all items regardless of the category (for profile page)
  getAllItems() {
    const apiUrl = this.apiUrl;
    this.getItemsFromServer(apiUrl);
  }

  // ------------------------------------------------------------------------
  // Get all items based on category (A, B) for map page
  getCategoryItems(category: string) {
    const apiUrl = this.apiUrl + category;
    this.getItemsFromServer(apiUrl);
  }

  getOldestItem() {
    const apiUrl = this.apiUrl + 'oldest-item';
    this.http.get<{message: string, items: any}>(apiUrl).subscribe(res => {
      console.log(res);
    });

  }

  // ------------------------------------------------------------------------
  // Get items from the server
  getItemsFromServer(apiUrl) {
    this.http.get<{message: string, items: any}>(apiUrl)
   .pipe(
      map(itemsData => {
        return {
          items: itemsData.items.map(item => {
            const itemDate = new Date(item.created_at);
            return {
              subject: item.subject,
              body: item.body,
              created_by: item.created_by,
              created_at: itemDate,
              detected_loc: {
                lat: item.detected_loc.coordinates[1], // lat is on 1 index (in DB)
                lng: item.detected_loc.coordinates[0], // lng is on 0 index (in DB)
              },
              provided_loc: {
                lat: item.provided_loc.coordinates[1], // lat is on 1 index (in DB)
                lng: item.provided_loc.coordinates[0]  // lng is on 1 index (in DB)
              },
              category: item.category,
              location: item.location,

            };
          })
        };
      }),
    )
    .subscribe((transoformedItems) => {
      this.items = transoformedItems.items;
      this.itemsUpdated.next({items: [...this.items]}); // notify subscribers
    }, error => {
      console.log(error);
    });
  }

  // ------------------------------------------------------------------------
  // Create new item (send to the server to store in DB)
  createItem(subject: string, body: string, category: string, detectedLoc: UserLocation, providedLoc: UserLocation, location: string) {
    const item = { subject, body, category, detectedLoc, providedLoc, location };
      // send to server with location name
    this.http.post(this.apiUrl + 'create', item).subscribe(res => {
      this.router.navigate(['/']); // navigate to home page
    }, error => {
      console.log(error);
    });
  }

}
