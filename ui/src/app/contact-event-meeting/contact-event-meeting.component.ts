import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DateService} from "../utils/date.service";
import {DataService} from "../utils/data.service";
import {AlertService} from "../alert.service";

@Component({
  selector: 'app-contact-event-meeting',
  templateUrl: './contact-event-meeting.component.html',
  styleUrls: ['./contact-event-meeting.component.css']
})
export class ContactEventMeetingComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private dateService: DateService,
              private dataService: DataService,
              private alertService: AlertService) { }

  event;
  loading: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.readMeeting(params['uuid']);
    });
  }

  readMeeting(uuid: string){
    this.loading = true;

    this.dataService.getContactEventMeeting(uuid).subscribe(
      data => {
        if(data.msg === "OK") {
          this.event = data.object;
        }else{
          this.alertService.error('مشکلی پیش آمده!');
        }
        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    )
  }

}
