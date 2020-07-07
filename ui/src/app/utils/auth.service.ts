import { Injectable } from '@angular/core';
import { LoginDetails } from './login-details';
import {Subject} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "../alert.service";
import {environment} from "../../environments/environment.prod";
import {User} from "../user";
import {DummyData} from "../dummyData";


const serverUrl = environment.serverUrl;

@Injectable()
export class AuthService {
  redirectUrl: string = '/';

  loggedIn: Subject<any> = new Subject<any>();
  loggedOut: Subject<any> = new Subject<any>();
  private loginDetails: LoginDetails = null;

  constructor(private localStorageService: LocalStorageService,
              private http: HttpClient,
              private alertService: AlertService) {
    this.loadFromSessionStorage();
  }

  login(loginDetails: LoginDetails): void {
    this.loginDetails = loginDetails;

    this.saveToSessionStorage();
  }

  logout(): void {
    if(this.isLoggedIn()) {
      this.localStorageService.checkOut(this.userId);
    }
    this.loginDetails = null;
    this.loggedOut.next();
    this.saveToSessionStorage();
  }

  get jsonWebToken(): string {
    return (this.loginDetails !== null) ? this.loginDetails.jsonWebToken : null;
  }

  get userId(): string {
    return (this.loginDetails !== null) ? this.loginDetails.userId : null;
  }

  get username(): string {
    return (this.loginDetails !== null) ? this.loginDetails.name : null;
  }

  get department(): string {
    return (this.loginDetails !== null) ? this.loginDetails.department : null;
  }

  private saveToSessionStorage() {
    if (this.storageAvailable('sessionStorage')) {
      let sessionStorage = window['sessionStorage'];

      if (this.jsonWebToken === null) {
        sessionStorage.removeItem('loginDetails');
      }
      else {
        sessionStorage['loginDetails'] = JSON.stringify(this.loginDetails);
      }
    }
  }

  private loadFromSessionStorage() {
    if (this.storageAvailable('sessionStorage')) {
      let sessionStorage = window['sessionStorage'];

      if ('loginDetails' in sessionStorage) {
        this.loginDetails = JSON.parse(sessionStorage['loginDetails']);
      }
    }
  }

  public isLoggedIn():boolean{
    return this.loginDetails !== null;
  }

  private storageAvailable(type) {
    let storage = window[type], x = '__storage_test__';
    try {
      (<any>storage).setItem(x, x);
      (<any>storage).removeItem(x);
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0;
    }
  }

  loginWithServer(username: string, password: string) {
    return this.http.post<any>( serverUrl+'/authenticate', { username: username, password: password })
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data && data.msg === "OK" && data.object.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          data.object.token =
            localStorage.setItem('currentUser', JSON.stringify(data.object));
          return data.object;

        }else if(data && data.msg === "INVALID_CREDENTIALS"){
          this.alertService.error("ایمیل یا کلمه عبور اشتباه است.")
        }

        return null;

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

  getCurrentUser() {
    return DummyData.USER;
  }

  getRoleString(){
    switch(this.getCurrentUser().role){
      case 'owner':
        return 'مدیر';
      case 'reception':
        return 'پذیرش';
      case 'user':
        return 'کاربر';
      default:
        return '';
    }
  }
}
