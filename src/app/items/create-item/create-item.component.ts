import { Component, OnInit } from '@angular/core';

import { ItemsService } from './../../services/items.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {
  isChecked = false;
  currLat = null;
  currLong = null;
  isCurrLocAdded = false;
  isLoading = true;

  constructor(private locService: LocationService, private itemService: ItemsService) {
    this.locService.getCurrentLocation()
    .then(loc => {
      this.isCurrLocAdded = true;
      this.isLoading = false;
      this.currLat = loc.lat;
      this.currLong = loc.lng;

      console.log('Current Location: ' + this.currLat + ' ' + this.currLong);

    })
    .catch(err => {
      console.log(err.code);
      this.isCurrLocAdded = false;
      this.isLoading = false;
    });
  }
  ngOnInit(): void {

  }

  onCreateItem() {
    this.itemService.getAddressFromLatLong(this.currLat, this.currLong).subscribe(result => {
      console.log(result.address.city);

    });
    // this.itemService.createItem();
  }

}
