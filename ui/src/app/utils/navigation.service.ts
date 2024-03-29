import {Injectable, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MeetingService} from "../meetings/meeting.service";

const homeUrls = [
  '/',
  '/meetings',
  '/home',
  '/login',
  '/register'
];
@Injectable({
  providedIn: 'root'
})
export class NavigationService{

  currentPath: string = '';

  constructor(private router: Router) {
    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.currentPath = this.router.url;
      }
    });
  }

  navigate(url, params = undefined){
    if(params){
      this.router.navigate([url, params]);
    }else{
      this.router.navigate([url]);
    }
  }

  goToHome(){
    this.router.navigate(['/']);
  }

  isHome(){
    return homeUrls.indexOf(this.currentPath) !== -1;
  }

  get currentLocation(){
    return this.currentPath;
  }
}
