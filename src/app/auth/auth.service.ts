import { UserData } from './user-data.model';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.backendUrl;
  constructor(private http: HttpClient) { }

  signup(username, email, password) {
    const userData: UserData = {
      username, email, password
    };

    this.http.post(this.backendUrl + 'api/users/signup', userData)
    .subscribe(result => {
      console.log(result);
    });
  }

  login(email, password) {

  }
}
