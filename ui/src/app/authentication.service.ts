import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {User} from "./user";

// const serverUrl = "/api";
const serverUrl = "http://0.0.0.0:8094/api";

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<any>( serverUrl+'/authenticate', { username: username, password: password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data && data.msg === "OK" && data.object.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(data.object));
        }

        // data.object is the user
        return data.object;
      }));
  }

  loginWithGoogle(user) {
    return this.http.post<any>( serverUrl+'/authenticate-with-google', user )
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data && data.msg === "OK" && data.object.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(data.object));
        }

        // data.object is the user
        return data.object;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  isLoggedIn():boolean{
    if(localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  getUser(): User{
    return JSON.parse(localStorage.getItem('currentUser'));
  }
}
