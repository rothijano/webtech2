import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserDto } from '../_models/user.dto';
import { User } from '../_models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: UserDto) {
    return this.http.post<User>(this.baseUrl + 'auth/login', model).pipe(
      map((response) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  get() {
    return this.http.get<User>(this.baseUrl + 'user', undefined).pipe(
      map((response) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  register(model: UserDto) {
    return this.http.post<User>(this.baseUrl + 'auth/register', model).pipe(
      map((response) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    return this.http.post(this.baseUrl + 'auth/logout', undefined);
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
}
