import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UserLocation } from './../../models/user-location.model';
import { LocationService } from './../../services/location.service';
import { ItemsService } from './../../services/items.service';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.css']
})
export class ItemDialogComponent implements OnInit {
  isChecked = true;
  isLoading = false;
  form: FormGroup;
  location = null;
  private detectedLocation: UserLocation = null;
  private providedLocation: UserLocation = null;

  leftPos;

  constructor(
    public dialogRef: MatDialogRef<ItemDialogComponent>,
    private locService: LocationService,
    private itemService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public data: {detectedLoc: UserLocation, providedLoc: UserLocation, leftPos: any}
    ) {
      this.leftPos = data.leftPos;
    }

  ngOnInit(): void {

    const matDialogConfig: MatDialogConfig = new MatDialogConfig();

    matDialogConfig.position = { left: `${this.leftPos}px`, top: `5rem` };
    matDialogConfig.width = '450px';
    matDialogConfig.height = 'auto';
    this.dialogRef.updateSize(matDialogConfig.width, matDialogConfig.height);
    this.dialogRef.updatePosition(matDialogConfig.position);


    // Create the form (Reactive Form)
    this.form = new FormGroup({
      subject: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      item_body: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
    });

    this.detectedLocation = this.data.detectedLoc;
    this.providedLocation = this.data.providedLoc;



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
      }, error => {
        console.log('could not get location address');
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
      this.dialogRef.close();
    } else {
      console.log('provided location is not set!');

    }
  }

}
