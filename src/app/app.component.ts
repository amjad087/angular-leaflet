import { Component, OnInit } from '@angular/core';

import { AuthService } from './services/auth.service';
import { LocationService } from './services/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'khalid';

  constructor(private authService: AuthService, private locService: LocationService) { }
  ngOnInit() {
    this.locService.initLocations();
    this.authService.autoLogin();
  }
}
