import {Component, OnInit} from '@angular/core';
import {DateService} from "../utils/date.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../utils/data.service";
import {CommonService} from "../utils/common.service";

@Component({
  selector: 'app-contact-meeting',
  templateUrl: './contact-meeting.component.html',
  styleUrls: ['./contact-meeting.component.css']
})
export class ContactMeetingComponent implements OnInit {

  constructor(public dateService: DateService,
              public commonService: CommonService,
              private route: ActivatedRoute,
              private dataService: DataService) { }

  event: any;
  loading: boolean = false;

  uuid: string = '';
  dateEventId: string  = '';
  action: string = '';
  guest: any;

  style: any;

  ngOnInit() {

    this.route.params.subscribe(params => {
      //contact-meeting/:uuid/:date-event-id/:action

      this.uuid = params['uuid'];
      this.dateEventId = params['dateId'];
      this.action = params['action'];
      this.style = this.commonService.getContactStatus(this.action);

      this.readMeeting();
    });

  }

  readMeeting(){
    this.loading = true;

    this.dataService.getMeetingByUUID(this.uuid, this.action).subscribe(
      data => {
        if( data['msg'] === "OK"){
          this.event = data['object'];

          this.event.attendees.forEach(att =>{
            if(att.you){
              this.guest = att;
            }
          });
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
