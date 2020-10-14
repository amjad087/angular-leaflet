import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { AuthService } from './../services/auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor { // user token interceptor for authorization

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken(); // get the token (retrived with the login method)
    // modify the request to append the token
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token) // append toaken in Authorization header
    });
    return next.handle(modifiedReq); // send the modified request
  }

}
