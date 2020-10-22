import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {coerceNumberProperty} from '@angular/cdk/coercion';
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
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any;
  items: Item[] = null;
  itemsSub: Subscription;
  detectedLocation: UserLocation = null; // auto detected current location
  providedLocation: UserLocation = null; // user can change / provide location
  mapLoaded = false;
  isLoading = true;
  isChecked = false;
  autoTicks = true;
  disabled = false;
  invert = true;
  max = 100;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;
  sliderStepsIn = 'minutes'; // will track of slider steps(whether they are in months, days, hours or minutes)

  constructor(
    private locService: LocationService,
    private itemsService: ItemsService,
    private markerService: MarkerService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.setSlider();
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

  private setSlider() {
    const category = this.isChecked ? 'B' : 'A';
    this.itemsService.getOldestItem(category).subscribe(res => {
     if (res.items.length > 0) {
        const item = res.items[0];
        const itemDate = new Date(item.created_at);
        const currDate = new Date();
        const difference = currDate.getTime() - itemDate.getTime(); // This will give difference in milliseconds
        let resultInMinutes = Math.round(difference / 60000);
        if (resultInMinutes === 0) {
          resultInMinutes = 1;
        }
        /*
        const minutesInYear = 525600;
        const minutesInMonth = 43800;
        const minutesInDay = 1440;
        const minutesInHour = 60;
        if (resultInMinutes >= minutesInYear) {
          this.max =  Math.round(resultInMinutes / minutesInMonth);
          this.sliderStepsIn = 'months';
        } else if (resultInMinutes >= minutesInMonth) {
          this.max =  Math.round(resultInMinutes / minutesInDay);
          this.sliderStepsIn = 'days';
        } else if (resultInMinutes >= minutesInDay) {
          this.max =  Math.round(resultInMinutes / minutesInHour);
          this.sliderStepsIn = 'hours';
        } else {
          this.max = resultInMinutes;
          this.sliderStepsIn = 'minutes';
          if (this.max > 30) {
            this.value = 30;
          }
        }
        */
        this.max = resultInMinutes;
        if (this.max > 30) {
          this.value = 30;
        } else {
          this.value = resultInMinutes;
        }
        console.log(this.value);

      }
      this.initMap();
    }, err => {
      this.initMap();
    });

  }
  // on creating new item event
  onCreateItem() {
    this.router.navigate(['/create-item']); // navigate to create item page
  }

  getItems() {
    const currDate = new Date();
    const itemsDate = this.addMinutes(currDate, this.value);

    this.markerService.removeMarkers(this.map);
    const category = this.isChecked ? 'B' : 'A';
    this.itemsService.getCategoryItems(category, itemsDate);
    this.itemsSub = this.itemsService.itemsUpdated.subscribe((itemsData: {items: Item[]}) => {
      this.items = itemsData.items;
      this.markerService.makeItemMarkers(this.items, this.map);
    });
  }

  public onSlideToggle(event: MatSlideToggleChange) {
    this.isChecked = event.checked;
    this.getItems();
  }

  // set map dragging to false when mouse enters the slider div,
  // otherwise map also gets dragged with slider
  DisableMapDragging() {
    this.map.dragging.disable();
  }

  // enabling map dragging when mouse leaves the slider div
  EnableMapDragging() {
    this.map.dragging.enable();
  }

  onSliderChange(event: any) {
    console.log(this.value);
    this.getItems();
  }

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

  addMinutes(date, minutes) {

    const minute = 1;
    const miliSecInMin = 60000;
    const calcMinutes = minute;
    /*
    const minutesInYear = 525600;
    const minutesInMonth = 43800;
    const minutesInDay = 1440;
    const minutesInHour = 60;

    if (this.sliderStepsIn === 'months') {
      calcMinutes = minutesInYear;
    } else if (this.sliderStepsIn === 'days') {
      calcMinutes = minutesInDay;
    } else if (this.sliderStepsIn === 'hours') {
      calcMinutes = minutesInHour;
    }*/

    const calcMiliSecs = calcMinutes * miliSecInMin;
    return new Date(date.getTime() - (minutes * calcMiliSecs));
  }

  ngOnDestroy() {
    if (this.itemsSub) {
      this.itemsSub.unsubscribe();
    }
  }

}
