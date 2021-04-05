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
}
