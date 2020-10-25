import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {coerceNumberProperty} from '@angular/cdk/coercion';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';

import { UserLocation } from './../models/user-location.model';
import { Item } from '../models/item.model';
import { LocationService } from '../services/location.service';
import { AuthService } from './../services/auth.service';
import { ItemsService } from '../services/items.service';
import { MarkerService } from './../services/marker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any;
  private _tickInterval = 1;

  items: Item[] = null;
  itemsSub: Subscription;
  detectedLocation: UserLocation = null; // auto detected current location
  providedLocation: UserLocation = null; // user can change / provide location
  mapLoaded = false;
  isLoading = true;
  isChecked = true;

  dialogOpened = false;

  // Silder's Setting Values
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
  sliderStepsDate: any;
  displayText = '1';

  locMarker: L.marker;
  constructor(
    private authService: AuthService,
    private locService: LocationService,
    private itemsService: ItemsService,
    private markerService: MarkerService,
    private router: Router,
    private dialog: MatDialog
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
        zoomControl: false, // by default zoom controls are placed on top left corner of the map,
                           // set it to false initially so that we could place it manually
        attributionControl: false
      });

      // placing zoom controls on bottom right corner of the map (beacuse create item button will be placed on top left corner)
      L.control.zoom({
        position: 'bottomright'
      }).addTo(this.map);

      // using openstreetmap tiles
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, // setting max zoom level

      });

      tiles.addTo(this.map);

      // Adding provided location marker
      // L.Marker.prototype.options.icon = this.markerService.iconDefault;
      // this.locMarker = L.marker([this.providedLocation.lat, this.providedLocation.lng]);
      // this.locMarker.on('dragend', event => {
      //   const position = event.target.getLatLng();
      //   this.locService.setProvidedLocation(position.lat, position.lng);
      // });
      // this.map.addLayer(this.locMarker);
      this.getItems(); // getting items from the server (database)
    })
    .catch(err => {
      this.mapLoaded = false;
      this.isLoading = false;
    });
  }

  // Setting slider's values based on the oldest item in the database
  private setSlider() {
    const category = this.isChecked ? 'B' : 'A';
    this.itemsService.getOldestItem(category).subscribe(res => {
      if (res.items.length > 0) {
        const item = res.items[0];
        const itemDate = new Date(item.created_at);
        const currDate = new Date();
        const difference = currDate.getTime() - itemDate.getTime(); // This will give difference in milliseconds
        let resultInMinutes = Math.round(difference / 60000);
        resultInMinutes += 20; // extra 20 minutes
        this.max = resultInMinutes;
        if (this.max > 30) {
          this.value = 30;
        } else {
          this.value = resultInMinutes;
        }
        const sliderDate = this.subtractMinutes(new Date(), this.value);
        this.sliderStepsDate = sliderDate.toLocaleDateString() + ', ' + sliderDate.toLocaleTimeString();
      }

      this.initMap(); // inint map after setting the slider up

    }, err => {
      this.initMap(); // if there is an error in getting items from the server, init the map
    });

  }

  // -------------------------------------------------------------------
  // on creating new item event
  onCreateItem(evt: MouseEvent) {
    const target = new ElementRef(evt.currentTarget);
    let rightPos = (target.nativeElement as HTMLElement).getBoundingClientRect().right;
    rightPos += 10; // getting righ position of the Create Item button (for showing dialog position)

    // left postion of the dialog will will be right postion of the button + 10

    this.dialogOpened = true;
    const dialogRef = this.dialog.open(
      ItemDialogComponent,
      { data: {detectedLoc: this.detectedLocation, providedLoc: this.providedLocation, leftPos: rightPos }}
    );
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpened = false;
      this.getItems();
    });
  }

  onEditItem(evt: MouseEvent, itemId: number) {
    const target = new ElementRef(evt.currentTarget);
    let rightPos = (target.nativeElement as HTMLElement).getBoundingClientRect().right;
    rightPos += 10; // getting righ position of the Create Item button (for showing dialog position)

    // left postion of the dialog will will be right postion of the button + 10

    this.dialogOpened = true;
    const dialogRef = this.dialog.open(
      ItemDialogComponent,
      { data:
        {
          detectedLoc: this.detectedLocation,
          providedLoc: this.providedLocation,
          leftPos: rightPos,
          itemId
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpened = false;
      this.getItems();
    });
  }

  onDeleteItem(itemId) {
    this.itemsService.deleteItem(itemId).subscribe(res => {
      this.getItems();
    }, err => {
      console.log(err);
    });
  }

  // -------------------------------------------------------------------
  // Get items from the server
  getItems() {
    const currDate = new Date();
    const itemsDate = this.subtractMinutes(currDate, this.value);

    this.markerService.removeMarkers(this.map);
    const category = this.isChecked ? 'B' : 'A';
    this.itemsService.getCategoryItems(category, itemsDate);
    this.itemsSub = this.itemsService.itemsUpdated.subscribe((itemsData: {items: Item[]}) => {
      this.items = itemsData.items;
      this.markerService.makeItemMarkers(this.items, this.map);
    });
  }

  // -------------------------------------------------------------------
  // on category slide change event
  public onSlideToggle(event: MatSlideToggleChange) {
    this.isChecked = event.checked;
    this.getItems(); // get items when category is changed
  }

  // -------------------------------------------------------------------
  // set map dragging to false when mouse enters the slider div,
  // otherwise map also gets dragged with slider
  DisableMapDragging() {
    this.map.dragging.disable();
  }

  // -------------------------------------------------------------------
  // enabling map dragging when mouse leaves the slider div
  EnableMapDragging() {
    this.map.dragging.enable();
  }

  // -------------------------------------------------------------------
  // on date slider changed event
  onSliderChange(event: any) {
    console.log(this.value);
    const sliderDate = this.subtractMinutes(new Date(), this.value);
    this.sliderStepsDate = sliderDate.toLocaleDateString() + ', ' + sliderDate.toLocaleTimeString();
    this.getItems();
  }

  // -------------------------------------------------------------------
  // get tick intervals (for date slider)
  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }

  // -------------------------------------------------------------------
  // Subtracte minutes (minutes are slider steps) to get the desired date
  subtractMinutes(date, minutes) {
    const minute = 1;
    const miliSecInMin = 60000;
    const calcMinutes = minute;
    const calcMiliSecs = calcMinutes * miliSecInMin;
    return new Date(date.getTime() - (minutes * calcMiliSecs));
  }

  getUser() {
    return this.authService.getUsername();
  }

  add3Dots(value: string) {
    const limit = 20;
    const dots = '...';
    if (value.length > limit) {
      // you can also use substr instead of substring
      value = value.substring(0, limit) + dots;
    }
    return value;
  }

  ngOnDestroy() {
    if (this.itemsSub) {
      this.itemsSub.unsubscribe(); // unsub to the subscription
    }
  }

}
