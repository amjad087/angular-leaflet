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
    private locService: LocationService
  ) { }

  // chained observables (first get all items with location coordinates,
  // then get location name for each item's coordinates)
  getTransformedItems(): Observable<any> {
    return this.http.get<{message: string, items: Item[]}>(this.apiUrl)
    .pipe(
      map(itemsData => itemsData.items),
      mergeMap((items: any[]) => {
        return forkJoin(
          items.map(item => {
            // Get location name from coordinates (http call, another observable)
            return this.locService.getAddressFromLatLong(item.provided_loc.coordinates[0], item.provided_loc.coordinates[1])
              .pipe(
                map((res: any) => {
                  item.location = res.address.city ? res.address.city : res.address.county;
                  return item;
                })
              );
          })
        );
      })
    );
  }

  getItems() {
    this.getTransformedItems()
    .subscribe((transformedItems: any) => {
      // map items data, as coordinates are saved in db as [lng, lat]
      // and on front end they are [lat, lng]
      // also there are extra information with coodinates in db (e.g. type: point)
      this.items = transformedItems.map( item => {
        return {
          subject: item.subject,
          body: item.body,
          created_by: item.created_by,
          created_at: item.created_at,
          detected_loc: {
            lat: item.detected_loc.coordinates[1], // lat is on 1 index (in DB)
            lng: item.detected_loc.coordinates[0], // lng is on 0 index (in DB)
          },
          provided_loc: {
            lat: item.provided_loc.coordinates[1], // lat is on 1 index (in DB)
            lng: item.provided_loc.coordinates[0]  // lng is on 1 index (in DB)
          },
          category: item.category,
          location: item.location
        };
      });
      this.itemsUpdated.next({items: this.items}); // notify subscribers
    }, error => {
      console.log(error);
    });
  }

  // Create new item (send to the server to store in DB)
  createItem(subject: string, body: string, category: string, detectedLoc: UserLocation, providedLoc: UserLocation) {
    const item = { subject, body, category, detectedLoc, providedLoc };
    this.http.post(this.apiUrl + 'create', item).subscribe(res => {
      console.log(res);
    }, error => {
      console.log(error);
    });
  }

}
