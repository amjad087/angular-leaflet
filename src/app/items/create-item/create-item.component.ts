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
  private detectedLocation: UserLocation = null;
  form: FormGroup;


  constructor(private locService: LocationService, private itemService: ItemsService) {
    // get current location using location service
    this.locService.getCurrentLocation()
    .then( loc => {
      this.detectedLocation = loc;
      this.isCurrLocAdded = true;
      this.isLoading = false;
    })
    .catch (err =>  {
      console.log('could not get current location!');

      this.isCurrLocAdded = false;
      this.isLoading = false;
    });
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      subject: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      item_body: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
    });
  }

  onCreateItem() {
    if (!this.form.valid) {
      return;
    }
    const providedLocation = this.locService.getProvidedLocation(); // get provided location
    // if detected and provided locations are set
    if (this.detectedLocation && providedLocation) {
      const category = this.isChecked ? 'B' : 'A';
      this.itemService.createItem(this.form.value.subject, this.form.value.item_body, category, this.detectedLocation, providedLocation);

    } else {
      console.log('provided location is not set!');

    }
  }

}
