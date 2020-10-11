import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { LocationService } from './location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map;

  constructor(private locService: LocationService) { }

  ngAfterViewInit(): void {

    this.initMap();
  }

  private initMap() {
    // Get cuurent location using the location service
    this.locService.getCurrentLocation().then(location => {
      // creating leaflat map object
      this.map = L.map('map', {
        center: [ location.lat, location.lng ], // center map according to the current location
        zoom: 5 // set initial zoom level
      });

      // using openstreetmap tiles
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, // setting max zoom level
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      tiles.addTo(this.map);
    });
  }

}
