import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthLoginData } from './../models/auth-login-data.model';
import { UserData } from '../models/user-data.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.backendUrl + 'users/'; // users api end points

  private token;
  private userId: string;
  private userAuthenticated = false;
  private authTokenListner = new Subject<boolean>(); // to reflect login and logout in other components e.g. header component
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  isAuth() {
    return this.userAuthenticated;
  }

  getAuthStatusListener() {
    return this.authTokenListner.asObservable();
  }

  // creating a new user
  createUser(username: string, email: string, password: string) {
    const userData: UserData = {
      username, email, password
    };

    this.http.post(this.apiUrl + 'signup', userData)
    .subscribe(result => {
      this.router.navigate(['/login']); // user signup, redirect to login page
    }, error => {
      console.log(error);
    });
  }

  getUserId() {
    return this.userId;
  }

  // Auto login (check if the user is already logged in, no need to log in on application reload)
  autoLogin() {
    const authData = this.getAuthData(); // get auth data from local storage
    if (!authData) {
      return;
    }

    const token = authData.token;
    const userId = authData.userId;
    const expDate = authData.expDate;

    const expiryDate = new Date(expDate);
    const expiresIn = expiryDate.getTime() - new Date().getTime();
    if (expiresIn > 0) { // if the token is not expired
      this.token = token;
      this.userId = userId;
      const expDuration = expiresIn / 1000;
      this.setTokenTimer(expDuration); // setting token timer (for auto logout on token expiration)
      this.userAuthenticated = true;
      this.authTokenListner.next(true);
    }
  }

  // user login
  login(usernameEmail: string, password: string) {
    // User can be logged in with username or email
    const userData = { usernameEmail, password };

    this.http.post<{loginData: AuthLoginData}>(this.apiUrl + 'login', userData)
    .subscribe(response => {
      if (response.loginData.token) {
        this.token = response.loginData.token;
        this.userId = response.loginData.userId;
        const expDuration = response.loginData.expiresIn;
        this.setTokenTimer(expDuration); // setting token timer (for auto logout on token expiration)
        this.saveAuthData(response.loginData); // save auth data in local storage of the browser
        this.userAuthenticated = true;
        this.authTokenListner.next(true);
        this.router.navigate(['/']); // navigate to home page
      }
    });
  }

  // Setting token timer for auto logout (on token expiration)
  private setTokenTimer(expDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expDuration * 1000); // multiplied by 1000 because setTimeout works in miliseconds
  }

  // Save auth data in local storage of the browser
  private saveAuthData(loginData: any) {
    const token = loginData.token;
    const userId = loginData.userId;
    const expiresIn = loginData.expiresIn;

    const now = new Date();
    const expDate = new Date(now.getTime() + expiresIn * 1000);

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expDate', expDate.toISOString());
  }

  // Clear auth data from local storage (on logout)
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expDate');
  }

  // Get Auth Data from local storage of the browser (for auto login)
  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expDate = localStorage.getItem('expDate');
    if (!token || !userId || !expDate) {
      return;
    }

    return {
      token,
      userId,
      expDate
    };
  }

  // logout user
  logout() {
    this.token = null;
    this.userId = null;
    this.userAuthenticated = false;
    this.clearAuthData(); // clear local storage
    this.authTokenListner.next(false); // to reflect in interested components
    clearTimeout(this.tokenTimer); // clear time out
    this.router.navigate(['/login']); // redirect to login page

  }
}
