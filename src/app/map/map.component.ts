import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { LocationService } from './location.service';

const ITEMS = [
  { user: 'Amjad', loc: 'Islamabad', title: 'Title1', uploaded: '20m'},
  { user: 'Khan', loc: 'Rawalpindi', title: 'Title2', uploaded: '15m'},
  { user: 'Talha', loc: 'Peshawar', title: 'Title3', uploaded: '25m'},
  { user: 'Zarar', loc: 'Bannu', title: 'Title4', uploaded: '30m'},

];
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: any;
  items = ITEMS;
  constructor(private locService: LocationService) { }

  ngOnInit(): void {

    this.initMap();
  }

  private initMap() {
    // Get cuurent location using the location service
    this.locService.getCurrentLocation().then(location => {
      // creating leaflat map object
      this.map = L.map('map', {
        center: [ location.lat, location.lng ], // center map according to the current location
        zoom: 5, // set initial zoom level
        zoomControl: false
      });

      L.control.zoom({
        position: 'bottomright'
      }).addTo(this.map);

      // using openstreetmap tiles
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, // setting max zoom level
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      tiles.addTo(this.map);
    });
  }

}
