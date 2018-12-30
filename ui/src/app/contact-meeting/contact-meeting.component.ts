import {Component, OnInit, ViewChild} from '@angular/core';
import {DateService} from "../date.service";
import {UtilService} from "../util.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";
import {SpinnerComponent} from "../spinner/spinner.component";

@Component({
  selector: 'app-contact-meeting',
  templateUrl: './contact-meeting.component.html',
  styleUrls: ['./contact-meeting.component.css']
})
export class ContactMeetingComponent implements OnInit {

  constructor(public dateService: DateService,
              public utilService: UtilService,
              private route: ActivatedRoute,
              private dataService: DataService) { }

  event: any;
  loading: boolean = false;

  uuid: string = '';
  dateEventId: string  = '';
  action: string = '';

  ngOnInit() {

    this.route.params.subscribe(params => {
      //contact-meeting/:uuid/:date-event-id/:action

      this.uuid = params['uuid'];
      this.dateEventId = params['dateId'];
      this.action = params['action'];

      this.readMeeting();
    });

  }

  readMeeting(){
    this.loading = true;

    this.dataService.getMeetingByUUID(this.uuid, this.action).subscribe(
      data => {
        if( data['msg'] === "OK"){
          this.event = data['object'];
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
