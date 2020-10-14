import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSub: Subscription; // used for login and logout
  isUserAuthenticated = false; // user is not authenticated initially

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.isAuth();
    // subscribe to auth status listner
    this.authListenerSub = this.authService.getAuthStatusListener() // get status from auth service
    .subscribe(isAuthenticated => {
      this.isUserAuthenticated = isAuthenticated; // user login and logout will be reflected here
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    // unsubscribe the subsciption when the user navigates away
    if (this.authListenerSub) {
      this.authListenerSub.unsubscribe();
    }
  }

}
