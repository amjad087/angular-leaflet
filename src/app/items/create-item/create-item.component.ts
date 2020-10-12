import { LocationService } from './../../map/location.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {
  isChecked = false;
  constructor(private locService: LocationService) { }
  currLat = null;
  currLong = null;
  isCurrLocAdded = false;
  isLoading = true;
  ngOnInit(): void {

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

}
