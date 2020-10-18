import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserLocation } from './../models/user-location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private detectedLocation: UserLocation = null;
  private providedLocation: UserLocation = null;
  constructor(private http: HttpClient) { }

  // initialise detected and provided locations with current location
  initLocations() {
    this.getCurrentLocation().then(loc => {
      this.detectedLocation = {
        lat: loc.lat,
        lng: loc.lng
      };
      this.providedLocation = {
        lat: loc.lat,
        lng: loc.lng
      };
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Get current location using navigator
  getCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(res => {
        resolve({lat: res.coords.latitude, lng: res.coords.longitude});
      },
      err => {
        reject(err);
      });
    });
  }

  // Get Detected Location
  getDetectedLocation() {
    return this.detectedLocation;
  }

  // get provided location (will be updated with markder dragging)
  getProvidedLocation() {
    return this.providedLocation;
  }

  setProvidedLocation(lat: number, lng: number) {
    this.providedLocation = { lat, lng };
  }

  getAddressFromLatLong(lng: number, lat: number) {
    const params = new HttpParams().set('format', 'jsonv2').set('lat', lat.toString()).set('lon', lng.toString());
    return this.http.get<{address: any}>('https://nominatim.openstreetmap.org/reverse', { params });
  }

  getLatlongFromAddress(address: string) {
    this.http.get('https://nominatim.openstreetmap.org/search?format=json&q=' + address).subscribe(res => {
      console.log(res);
    });
  }

}
