import { map } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Item } from './../../models/item.model';
import { ItemsService } from './../../services/items.service';
import { LocationService } from '../../services/location.service';
import { UserLocation } from './../../models/user-location.model';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {
  itemId = null;
  isChecked = false;
  isLoading = true;
  location = null;
  private detectedLocation: UserLocation = null;
  private providedLocation: UserLocation = null;
  form: FormGroup;

  item: Item;
  constructor(
    private locService:
    LocationService,
    private itemService: ItemsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initSelf();
  }

  initSelf() {
    this.isLoading = true;
    // Create the form (Reactive Form)
    this.form = new FormGroup({
      subject: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      item_body: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
    });
    // subscribe to params map to get the item id
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.itemId = paramMap.get('itemId');
      // get the item using its id
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
          subject: tranformedItem.subject,
          item_body: tranformedItem.body,
        });

      }, error => {
        console.log(error);
        this.isLoading = false; // set loading to false on any error as well
      });
    });
  }

  onEditItem() {
    if (!this.form.valid) {
      return;
    }
    // if detected and provided locations are set
    if (this.item.detected_loc && this.item.provided_loc && this.item.location) {
      const category = this.isChecked ? 'B' : 'A';
      this.itemService.editItem(
        this.form.value.subject,
        this.form.value.item_body,
        category,
        this.item.detected_loc,
        this.item.provided_loc,
        this.item.location,
        this.itemId
      );

    } else {
      console.log('provided location is not set!');

    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
