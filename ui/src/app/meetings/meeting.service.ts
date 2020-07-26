import { Injectable } from '@angular/core';
import {NavigationService} from "../utils/navigation.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  readMeetings: Subject<any> = new Subject<any>();
  date: Date;
  showAll: boolean = true;

  constructor(private navigationService: NavigationService) { }

  loadMeetings(date: Date, showAll: boolean){
    this.date = date;
    this.showAll = showAll;

    if(this.navigationService.currentPath !== '/meetings'){
      this.navigationService.navigate('/meetings');
    }else{
      this.readMeetings.next();
    }
  }

  getDate(){

    if(!this.date || this.showAll){
      let d = new Date();
      d.setHours(0,0,0,0);
      return d;
    }
    return this.date;
  }

  isShowingAll(){
    return this.showAll;
  }
}
