import { Injectable } from '@angular/core';
import { Router }  from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  navigate(url, params = undefined){
    if(params){
      this.router.navigate([url, params]);
    }else{
      this.router.navigate([url]);
    }
  }
}
