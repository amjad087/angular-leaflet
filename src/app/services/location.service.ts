import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

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
}
