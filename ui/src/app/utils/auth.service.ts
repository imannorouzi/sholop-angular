import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {LocalStorageService} from './local-storage.service';
import { map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertService} from '../alert.service';
import {environment} from '../../environments/environment';
import {User} from '../user';


const serverUrl = environment.serverUrl;

@Injectable()
export class AuthService {
  redirectUrl = '/';

  loggedIn: Subject<any> = new Subject<any>();
  loggedOut: Subject<any> = new Subject<any>();
  private user: User = null;

  constructor(private localStorageService: LocalStorageService,
              private http: HttpClient,
              private alertService: AlertService) {
    this.loadFromSessionStorage();
  }

  login(user: User): void {
    this.user = user;

    this.saveToSessionStorage(user);
  }

  logout(): void {
    if (this.isLoggedIn()) {
      this.localStorageService.checkOut(this.userId);
    }
    this.user = null;
    this.loggedOut.next();
    this.saveToSessionStorage(this.user);
  }

  get jsonWebToken(): string {
    return (this.user !== null) ? this.user.token : null;
  }

  get userId(): number {
    return (this.user !== null) ? this.user.id : null;
  }

  get username(): string {
    return (this.user !== null) ? this.user.username : null;
  }

  get name(): string {
    return (this.user !== null) ? this.user.name : null;
  }

  get imageUrl(): string {
    if (this.user !== null) {
      return this.user.imageUrl ? this.user.imageUrl : 'assets/images/user-placeholder.png';
    }
  }

  private saveToSessionStorage(user) {
    if (this.storageAvailable('sessionStorage')) {
      const sessionStorage = window['sessionStorage'];

      if (!this.jsonWebToken) {
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    }
  }

  private loadFromSessionStorage() {
    if (this.storageAvailable('sessionStorage')) {
      const sessionStorage = window['sessionStorage'];

      if ('user' in sessionStorage) {
        this.user = JSON.parse(sessionStorage['user']);
      }
    }
  }

  public isLoggedIn(): boolean {
    return this.user !== null;
  }

  private storageAvailable(type) {
    const storage = window[type], x = '__storage_test__';
    try {
      (<any>storage).setItem(x, x);
      (<any>storage).removeItem(x);
      return true;
    } catch (e) {
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
    const apiUrl = serverUrl + '/authenticate';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>( apiUrl, JSON.stringify({username: username, password: password}), {headers: headers})

      .pipe(map(data => JSON.parse(data.entity)) )
      .pipe(map(data => {
          // login successful if there's a jwt token in the response
          if (data && data.msg === 'OK' && data.object.token) {
            return data.object;
          } else if (data && data.msg === 'INVALID_CREDENTIALS') {
            this.alertService.error('ایمیل یا کلمه عبور اشتباه است.');
          }
          return null;
        },
        error => {
          console.log(error);
        }));
  }

  register(user: User) {
    const apiUrl = serverUrl + '/register';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>( apiUrl, JSON.stringify(user), {headers: headers})

      .pipe(map(data => JSON.parse(data.entity)) )
      .pipe(map(data => {
          // login successful if there's a jwt token in the response
          if (data && data['msg'] === 'OK' && data['object'].token) {
            this.alertService.success('ثبت نام شما با موفقیت انجام شد.', true);
            return data.object;
          } else if (data && data['msg'] === 'DUPLICATE') {
            this.alertService.error('این ایمیل قبلا ثبت نام کرده است.', true);
          } else {
            this.alertService.error('مشکلی به وجود آمد. لطفا دوباره تلاش کنید.', true);
          }
          return null;
        },
        error => {
          console.log(error);
        }));
  }

  loginWithGoogle(user) {
    return this.http.post<any>( serverUrl + '/authenticate-with-google', user )
      .pipe(map(data => {
        // login successful if there's a jwt token in the response
        if (data && data.msg === 'OK' && data.object.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.login(data.object);
        }

        // data.object is the user
        return data.object;
      }));
  }

  getCurrentUser() {
    return this.user;
  }

  getRoleString() {
    if (this.getCurrentUser()) {
      switch (this.getCurrentUser().role) {
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
}
