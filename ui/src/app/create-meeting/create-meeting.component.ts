import { Component, OnInit } from '@angular/core';
import {Venue} from "../venue";
import {DateService} from "../date.service";

@Component({
  selector: 'create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {

  event = {
    dates: [],
    attendees: [],
    title: '',
    venue: new Venue(),
    chairId: -1,
    welcomeMessage: "",
    eventType: "MEETING",
  };


  constructor(private dateService: DateService) { }

  ngOnInit() {

    let d = new Date();

    let date = new Date(d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );

    this.event.dates.push({date: date, startTime: '0900', endTime: '1000', dateString: this.dateService.greToPersian(date, true)});
  }

}
