import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ErrorDialogComponent } from './../error-dialog/error-dialog.component';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'An unknown error occured!';
        if (error.error.message) {
          message = error.error.message;
        }
        this.dialog.open(ErrorDialogComponent, {data: {message}});
        return throwError(error);
      })
    );
  }
}
