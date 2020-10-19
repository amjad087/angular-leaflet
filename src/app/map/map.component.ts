import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

import { UserLocation } from './../models/user-location.model';
import { Item } from '../models/item.model';
import { LocationService } from '../services/location.service';
import { ItemsService } from '../services/items.service';
import { MarkerService } from './../services/marker.service';
import { Subscription } from 'rxjs';

// for known issue of leaflet icon images not showing correctly,
// you have to provide it manually
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});


const greenIcon = new L.Icon({
  iconUrl: 'assets/marker-icon-2x-green.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = iconDefault;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  private map: any;
  items: Item[] = null;
  itemsSub: Subscription;
  detectedLocation: UserLocation = null; // auto detected current location
  providedLocation: UserLocation = null; // user can change / provide location
  mapLoaded = false;
  isLoading = true;
  constructor(
    private locService: LocationService,
    private itemsService: ItemsService,
    private markerService: MarkerService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.getItems();
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
      L.Marker.prototype.options.icon = iconDefault;
      const marker = new L.marker([this.providedLocation.lat, this.providedLocation.lng], {draggable: 'true'});
      marker.on('dragend', event => {
        const position = event.target.getLatLng();
        this.locService.setProvidedLocation(position.lat, position.lng);
      });
      this.map.addLayer(marker);
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
    this.itemsService.getItems();
    this.itemsSub = this.itemsService.itemsUpdated.subscribe((itemsData: {items: Item[]}) => {
      this.items = itemsData.items;

      // adding markers for each item
      L.Marker.prototype.options.icon = greenIcon; // change marker icon
      for (const item of this.items) {
        const marker = new L.marker([item.provided_loc.lat, item.provided_loc.lng]);
        marker.on('click', event => {
          const position = event.target.getLatLng();
          this.markerService.openToolTipDialog(item, position);
        });
        marker.addTo(this.map);
      }
    });
  }

  ngOnDestroy() {
    if (this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
  }

}
