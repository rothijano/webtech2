import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) { }

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe<boolean>(
      map(user => {
        if (user) {
          return true;
        }

        window.alert("Ön nincs bejelentkezve! A folytatáshoz kérem jelentkezzen be!");

        return false;
      })
    );
  }

}
