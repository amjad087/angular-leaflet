import { Item } from './../../models/item.model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, switchMap, tap, map } from 'rxjs/operators';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import { UserLocation } from './../../models/user-location.model';
import { LocationService } from './../../services/location.service';
import { ItemsService } from './../../services/items.service';

interface geoSearchResult {
  x: number; // lon
  y: number; // lat
  label: string; // formatted address
  bounds: [
    [number, number], // south, west - lat, lon
    [number, number], // north, east - lat, lon
  ];
  raw: any; // raw provider result
}

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.css']
})
export class ItemDialogComponent implements OnInit {
  isChecked = true;
  isLoading = false;
  isSearchLoading = false;
  errorMsg = '';
  form: FormGroup;
  location = null;
  private detectedLocation: UserLocation = null;
  private providedLocation: UserLocation = null;
  filteredLocations: geoSearchResult[] = [];
  leftPos;
  isEditMode = false;
  item: Item = null;
  itemId: number;

  constructor(
    public dialogRef: MatDialogRef<ItemDialogComponent>,
    private locService: LocationService,
    private itemService: ItemsService,
    @Inject(MAT_DIALOG_DATA) public data:
      {
        detectedLoc: UserLocation,
        providedLoc: UserLocation,
        leftPos: any,
        itemId: number,
        location: string
      }
    ) {
      this.leftPos = data.leftPos;
      this.detectedLocation = this.data.detectedLoc;
      this.providedLocation = this.data.providedLoc;

    }

  ngOnInit(): void {

    const matDialogConfig: MatDialogConfig = new MatDialogConfig();

    matDialogConfig.position = { left: `${this.leftPos}px`, top: `5rem` };
    matDialogConfig.width = '550px';
    matDialogConfig.height = 'auto';
    this.dialogRef.updateSize(matDialogConfig.width, matDialogConfig.height);
    this.dialogRef.updatePosition(matDialogConfig.position);


    // Create the form (Reactive Form)
    this.form = new FormGroup({
      search_location: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      subject: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      item_body: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
    });

    if (this.data.itemId) {
      this.isEditMode = true;
      this.itemId = this.data.itemId;
      this.itemService.getItem(this.itemId)
      .pipe(
        map(resData => {
          const itemDate = new Date(resData.item.created_at);

          return {
            id: resData.item._id,
            subject: resData.item.subject,
            body: resData.item.body,
            created_by: resData.item.created_by,
            created_at: itemDate,
            detected_loc: {
              lat: resData.item.detected_loc.coordinates[1], // lat is on 1 index (in DB)
              lng: resData.item.detected_loc.coordinates[0], // lng is on 0 index (in DB)
            },
            provided_loc: {
              lat: resData.item.provided_loc.coordinates[1], // lat is on 1 index (in DB)
              lng: resData.item.provided_loc.coordinates[0]  // lng is on 1 index (in DB)
            },
            location: resData.item.location,
            category: resData.item.category
          };
        })
      )
      .subscribe(tranformedItem => {
        this.isLoading = false;
        this.item = tranformedItem;
        this.isChecked = tranformedItem.category === 'B' ? true : false;
        this.form.setValue({
          search_location: tranformedItem.location,
          subject: tranformedItem.subject,
          item_body: tranformedItem.body,
        });

      }, error => {
        console.log(error);
        this.isLoading = false; // set loading to false on any error as well
      });
    }
    const provider = new OpenStreetMapProvider();
    this.form.get('search_location').valueChanges
    .pipe(
      debounceTime(250),
      tap(() => {
        this.errorMsg = '';
        this.filteredLocations = [];
        this.isSearchLoading = true;
      }),
      switchMap(term => provider.search({ query: term }))
    )
    .subscribe((results: geoSearchResult[]) => {
      if(results.length > 0) {
        this.isSearchLoading = false;
        this.errorMsg = '';
        this.filteredLocations = results;
      }
    });
  }

  onCreateOrEditItem() {
    if (!this.form.valid) {
      return;
    }
    this.location = this.form.value.search_location;
    if (this.filteredLocations.length > 0) {
      const fileteredLoc = this.filteredLocations.find(loc => loc.label === this.location);
      if (fileteredLoc) { // if location found in the array
        this.providedLocation.lat = fileteredLoc.y;
        this.providedLocation.lng = fileteredLoc.x;
      }
    }

    // if detected and provided locations are set
    if (this.detectedLocation && this.providedLocation && this.location) {
      console.log(this.detectedLocation, this.providedLocation, this.location);
      const category = this.isChecked ? 'B' : 'A';
      if(this.isEditMode) {
        this.itemService.editItem(
          this.form.value.subject,
          this.form.value.item_body,
          category, this.detectedLocation,
          this.providedLocation, this.location,
          this.itemId
        );
      } else {
        this.itemService.createItem(
          this.form.value.subject,
          this.form.value.item_body,
          category, this.detectedLocation,
          this.providedLocation, this.location
        );
      }
      this.dialogRef.close();
    } else {
      console.log('provided location is not set!');

    }
  }

  displayFn(loc: geoSearchResult) {
    if (!loc) {
      return '';
    }
    return loc.label ? loc.label : loc;
  }

}
