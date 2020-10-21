import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

import { UserLocation } from './../models/user-location.model';
import { Item } from '../models/item.model';
import { LocationService } from '../services/location.service';
import { ItemsService } from '../services/items.service';
import { MarkerService } from './../services/marker.service';
import { Subscription } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map: any;
  items: Item[] = null;
  itemsSub: Subscription;
  detectedLocation: UserLocation = null; // auto detected current location
  providedLocation: UserLocation = null; // user can change / provide location
  mapLoaded = false;
  isLoading = true;
  isChecked = false;
  constructor(
    private locService: LocationService,
    private itemsService: ItemsService,
    private markerService: MarkerService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {

    this.initMap();
  }

  private initMap() {
    // Get cuurent location using the location service
    this.locService.getCurrentLocation()
    .then(loc => {
      this.detectedLocation = loc;
      // initialise provided location to detected location (in location service) if not already set
      // if (!this.locService.getProvidedLocation()) {
      this.locService.setProvidedLocation(loc.lat, loc.lng);
      // }

      this.providedLocation = this.locService.getProvidedLocation(); // for marker
      this.mapLoaded = true;
      this.isLoading = false;

      // creating leaflat map object
      this.map = L.map('map', {
        center: [ this.detectedLocation.lat, this.detectedLocation.lng ], // center map according to the current location
        zoom: 5, // set initial zoom level
        zoomControl: false // by default zoom controls are placed on top left corner of the map,
                           // set it to false initially so that we could place it manually
      });

      // placing zoom controls on bottom right corner of the map (beacuse create item button will be placed on top left corner)
      L.control.zoom({
        position: 'bottomright'
      }).addTo(this.map);

      // using openstreetmap tiles
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19 // setting max zoom level
      });

      tiles.addTo(this.map);

      // draggable marker for provided location
      L.Marker.prototype.options.icon = this.markerService.iconDefault;
      const marker = new L.marker([this.providedLocation.lat, this.providedLocation.lng], {draggable: 'true'});
      marker.on('dragend', event => {
        const position = event.target.getLatLng();
        this.locService.setProvidedLocation(position.lat, position.lng);
      });
      this.map.addLayer(marker);

      this.getItems();
    })
    .catch(err => {
      this.mapLoaded = false;
      this.isLoading = false;
    });
  }

  // on creating new item event
  onCreateItem() {
    this.router.navigate(['/create-item']); // navigate to create item page
  }

  getItems() {
    this.markerService.removeMarkers(this.map);
    const category = this.isChecked ? 'B' : 'A';
    this.itemsService.getCategoryItems(category);
    this.itemsSub = this.itemsService.itemsUpdated.subscribe((itemsData: {items: Item[]}) => {
      this.items = itemsData.items;
      this.markerService.makeItemMarkers(this.items, this.map);
    });
  }

  public onSlideToggle(event: MatSlideToggleChange) {
    this.isChecked = event.checked;
    this.getItems();
}

  ngOnDestroy() {
    if (this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
  }

}
