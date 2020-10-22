import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ItemsService } from './../../services/items.service';
import { LocationService } from '../../services/location.service';
import { UserLocation } from './../../models/user-location.model';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {
  isChecked = false;
  isCurrLocAdded = false;
  isLoading = true;
  location = null;
  private detectedLocation: UserLocation = null;
  private providedLocation: UserLocation = null;
  form: FormGroup;


  constructor(private locService: LocationService, private itemService: ItemsService, private router: Router) { }

  ngOnInit(): void {
    this.initSelf();
  }

  initSelf() {
    this.isLoading = true;
    // get current location using location service
    this.locService.getCurrentLocation()
    .then( loc => {
      this.detectedLocation = loc;
      // if provided location is not already set then set provided location to current location
      if (!this.locService.getProvidedLocation()) {
        this.locService.setProvidedLocation(loc.lat, loc.lng);
      }
      this.providedLocation = this.locService.getProvidedLocation();
      // get location address
      this.locService.getAddressFromLatLong(this.providedLocation.lng, this.providedLocation.lat)
      .subscribe(res => {
        this.location = 'Address not found';
        if (res.address.city) {
          this.location = res.address.city;
        } else if (res.address.county) {
          this.location = res.address.county;
        } else if (res.address.region) {
          this.location = res.address.region;
        } else if (res.address.state) {
          this.location = res.address.state;
        }
        // this.location = res.address.city ? res.address.city : res.address.county;
        this.isCurrLocAdded = true;
        this.isLoading = false;

        this.form = new FormGroup({
          subject: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
          item_body: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        });

      }, error => {
        console.log('could not get location address');
        this.isCurrLocAdded = false;
        this.isLoading = false;
      });
    })
    .catch (err =>  {
      console.log('could not get current location!');

      this.isCurrLocAdded = false;
      this.isLoading = false;
    });
  }

  onCreateItem() {
    if (!this.form.valid) {
      return;
    }
    // if detected and provided locations are set
    if (this.detectedLocation && this.providedLocation && this.location) {
      const category = this.isChecked ? 'B' : 'A';
      this.itemService.createItem(
        this.form.value.subject,
        this.form.value.item_body,
        category, this.detectedLocation,
        this.providedLocation, this.location
      );

    } else {
      console.log('provided location is not set!');

    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }

}
