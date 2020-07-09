import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {GlobalDataService} from "./global-data.service";
import {AlertService} from "../alert.service";

@Injectable()
export class LocalStorageService {

  checkedIn: boolean = false;

  checkInChanged: Subject<boolean> = new Subject<boolean>();

  session : any = { id: '', lastCheckIn: undefined };

  interval;

  constructor(private alertService: AlertService,
              private globalDataService: GlobalDataService) { }

  private getValidOpenSessions(openSessions: any) {
    let retVal = [];
    if(!Array.isArray(openSessions)) openSessions = [];

    let now = new Date();
    openSessions.forEach( os => {
      let lastCheckedIn = new Date(os.lastCheckIn);
      if(now.getTime() - lastCheckedIn.getTime() <= 40000){
        // Could be still active
        retVal.push(os);
      }
    });
    return retVal;
  }

  public checkIn(userId = '') : boolean {
    // It's an array of objects [{id: XX, lastCheckIn: XX}, ... ]
    let openSessions;
    try{
      openSessions = JSON.parse(localStorage.getItem('open-sessions-' + userId));
    }catch(e){
      openSessions = [];
    }

    if(openSessions !== undefined ){
      openSessions = this.getValidOpenSessions(openSessions);
      if(openSessions.length > 2){
        this.alertService.error('Too many sessions');
        return false;
      }
    }else{
      openSessions = [];
    }

    // check in
    this.session = {id: this.makeId(10), lastCheckIn: new Date()};
    openSessions.push(this.session);
    localStorage.setItem('open-sessions-' + userId, JSON.stringify(openSessions));
    this.globalDataService.loadFromLocalStorage(userId);
    this.checkedIn = true;
    setTimeout( () => {this.checkInChanged.next(this.checkedIn);}, 10);

    this.interval = setInterval( () => {
      this.session.lastCheckIn = new Date();
      let os = openSessions.find( os => os.id === this.session.id);
      os.lastCheckIn = this.session.lastCheckIn;
      localStorage.setItem('open-sessions-' + userId, JSON.stringify(openSessions));
    }, 30000);

    return true;

  }

  public checkOut(userId: number){
    if(!this.checkedIn){
      return;
    }

    let openSessions;
    try{
      openSessions = JSON.parse(localStorage.getItem('open-sessions-' + userId));
      openSessions = this.getValidOpenSessions(openSessions);
    }catch (e) {
      openSessions = [];
    }

    let os = openSessions.find( os => os.id === this.session.id);
    if(os) openSessions.splice(openSessions.indexOf(os), 1);

    localStorage.setItem('open-sessions-' + userId, JSON.stringify(openSessions));

    clearInterval(this.interval);

    this.checkedIn = false;
    this.checkInChanged.next(this.checkedIn);
  }

  public isCheckedIn(): boolean{
    return this.checkedIn;
  }

  private makeId(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
