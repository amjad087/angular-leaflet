import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';

import { Item } from './../items/item.model';
import { LocationService } from './location.service';
import { ItemsService } from './../items/items.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: any;
  items: Item[] = null;
  mapLoaded = false;
  isLoading = true;
  constructor(
    private locService: LocationService,
    private itemsService: ItemsService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.initMap();
    this.getItems();
  }

  private initMap() {
    // Get cuurent location using the location service
    this.locService.getCurrentLocation()
    .then(location => {
      this.mapLoaded = true;
      this.isLoading = false;
      // creating leaflat map object
      this.map = L.map('map', {
        center: [ location.lat, location.lng ], // center map according to the current location
        zoom: 5, // set initial zoom level
        zoomControl: false // by default zoom controls are placed on top left corner of the map,
                           // set it to false initially so that we could place it manually
      });

      // placing zoom controls on bottom right corner of the map
      L.control.zoom({
        position: 'bottomright'
      }).addTo(this.map);

      // using openstreetmap tiles
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19 // setting max zoom level
      });
      tiles.addTo(this.map);

    })
    .catch(err => {
      console.log(err.code);
      this.mapLoaded = false;
      this.isLoading = false;
    });
  }

  onCreateItem() {
    this.router.navigate(['/create-item']);
  }

  getItems() {
    this.items = this.itemsService.getItems();
  }

}
