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
    userId: -1,
    welcomeMessage: "",
    eventType: "MEETING",
  };


  constructor(private dateService: DateService) { }

  ngOnInit() {

    this.event.dates.push({date: this.dateService.getSholopDate().gDate, startTime: '0900', endTime: '1000'});
  }

}
