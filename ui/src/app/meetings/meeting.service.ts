import { Injectable } from '@angular/core';
import {NavigationService} from '../utils/navigation.service';
import {Subject} from 'rxjs';

export enum readMethod {INITIAL, MORE_FORWARD, MORE_BACKWARD}

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  readMeetings: Subject<readMethod> = new Subject<readMethod>();
  date: Date;
  period = 5; // days with or without meetings
  limit = 1; // days with meetings

  constructor(private navigationService: NavigationService) { }

  loadMeetings(date: Date | undefined) {
    this.date = date;
    if (this.navigationService.currentPath !== '/meetings') {
      this.navigationService.navigate('/meetings');
    } else {
      this.readMeetings.next(readMethod.INITIAL);
    }
  }

  getDate() {

    if (!this.date) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      this.date = d;
      return d;
    }
    return this.date;
  }

  localize(ev) {
    // convert dates from UTC to local
    ev.dates.forEach(ed => {
      /*date: "Apr 6, 2021, 2:00:00 PM"
        dateString: "چهارشنبه، 18 فروردین 1400 از 13:37 تا 13:37"
        endTime: "Apr 7, 2021, 3:37:45 AM"
        eventId: 412
        id: 413
        startTime: "Apr 7, 2021, 3:37:45 AM"*/
      ed.date = new Date(ed.date + ' UTC');
      ed.startTime = new Date(ed.startTime + ' UTC');
      ed.endTime = new Date(ed.endTime + ' UTC');
    });
    if(ev.pointedDate){

      ev.pointedDate.date = new Date(ev.pointedDate.date + ' UTC');
      ev.pointedDate.startTime = new Date(ev.pointedDate.startTime + ' UTC');
      ev.pointedDate.endTime = new Date(ev.pointedDate.endTime + ' UTC');
    }

    return ev;
  }
}
