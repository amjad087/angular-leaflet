import {
  Injectable,
  ComponentFactoryResolver,
  ComponentRef, Injector
} from '@angular/core';
import * as L from 'leaflet';

import { Item } from './../models/item.model';
import { MarkerDialogComponent } from './../map/marker-dialog/marker-dialog.component';
import { UserLocation } from './../models/user-location.model';

// for known issue of leaflet icon images not showing correctly,
// you have to provide it manually
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';

const greenIcon = new L.Icon({
  iconUrl: 'assets/marker-icon-2x-green.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export class Marker {
  constructor(
    private subject: string,
    private body: string,
    private position: L.LatLngExpression,
    private location: string,
    private category: string
  ) {}
}

interface MarkerMetaData {
  markerInstance: L.Marker;
  componentInstance: ComponentRef<MarkerDialogComponent>;
}

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  iconDefault = L.icon({
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });

  markers: MarkerMetaData[] = [];

  componentInstance: ComponentRef<MarkerDialogComponent>;

  constructor(private resolver: ComponentFactoryResolver, private injector: Injector) { }

  openToolTipDialog(item: Item, pos: UserLocation) {
    // this.dialog.open(MarkerDialogComponent, {data: {item}});

  }

  makeItemMarkers(items: Item[], map: L.map) {
    // adding markers for each item
    L.Marker.prototype.options.icon = greenIcon; // change marker icon
    for (const item of items) {
      const lat = item.provided_loc.lat;
      const lng = item.provided_loc.lng;
      const marker = new Marker(item.subject, item.body, item.provided_loc, item.location, item.category);

      const factory = this.resolver.resolveComponentFactory(MarkerDialogComponent);

      // we need to pass in the dependency injector
      const component = factory.create(this.injector);

      // wire up the @Input() or plain variables (doesn't have to be strictly an @Input())
      component.instance.data = marker;
      // we need to manually trigger change detection on our in-memory component
      // s.t. its template syncs with the data we passed in
      component.changeDetectorRef.detectChanges();

      const m = L.marker([lat, lng]);

      // pass in the HTML from our dynamic component
      const popupContent = component.location.nativeElement;

      // add popup functionality
      m.bindPopup(popupContent).openPopup();


      // finally add the marker to the map s.t. it is visible
      m.addTo(map);
      // add a metadata object into a local array which helps us
      // keep track of the instantiated markers for removing/disposing them later
      this.markers.push({
        markerInstance: m,
        componentInstance: component
      });
    }
  }

  removeMarkers(map: L.map) {

    for (let i = this.markers.length; i--;) {
      const marker = this.markers[i];
      marker.markerInstance.removeFrom(map);
      marker.componentInstance.destroy();
      this.markers.splice(i, 1);
    }
  }
}
