import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getCurrentLocation(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
          resolve({lat: resp.coords.latitude, lng: resp.coords.longitude});
        },
        err => {
          reject(err);
        });
    });
  }
}
