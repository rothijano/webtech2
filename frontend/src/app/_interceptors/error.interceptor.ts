import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpException } from '../_models/http-exception';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private snackBar: MatSnackBar, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe<any>(
      catchError(error => {
        if (error) {
          const exception: HttpException = error.error;

          switch (exception.status) {
            case 401: // Unauthorized
              if (localStorage.getItem('user')) {
                this.snackBar.open(`You are not logged in. Please login to continue!`, undefined, { duration: 7.5 * 1000 });
                this.router.navigateByUrl('/login');
              }
              break;
          
            default:
              this.snackBar.open(`${exception.message} (${exception.status})`, undefined, { duration: 7.5 * 1000 });
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
