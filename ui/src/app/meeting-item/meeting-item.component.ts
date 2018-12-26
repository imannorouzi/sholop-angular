import {Component, Input, OnInit} from '@angular/core';
import {DateService} from "../date.service";
import {UtilService} from "../util.service";

@Component({
  selector: 'meeting-item',
  templateUrl: './meeting-item.component.html',
  styleUrls: ['./meeting-item.component.css']
})
export class MeetingItemComponent implements OnInit {

  @Input() event: any;

  attendeesString: string;

  constructor(public dateService: DateService,
              public utilService: UtilService) {
  }

  ngOnInit() {
    if(this.event.attendees.length === 1){
      this.attendeesString = this.event.attendees[0].name;
    }else if(this.event.attendees.length === 2){
      this.attendeesString = this.event.attendees[0].name + '، ' + this.event.attendees[1].name;
    }else if(this.event.attendees.length > 2){
      this.attendeesString = this.event.attendees[0].name + ' و ' + (this.event.attendees.length - 1) + ' میهمان دیگر';
    }

  }

}
