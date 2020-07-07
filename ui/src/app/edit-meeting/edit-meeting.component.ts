import {Component, OnInit} from '@angular/core';
import {DateService} from "../utils/date.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../utils/data.service";
import {CommonService} from "../utils/common.service";

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css']
})
export class EditMeetingComponent implements OnInit {

  event: any;
  loading: boolean = false;


  constructor(public dateService: DateService,
              public commonService: CommonService,
              private route: ActivatedRoute,
              private dataService: DataService) {
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.readMeeting(params['id']);
    });
  }

  readMeeting(id){
    this.loading = true;

    this.dataService.getMeeting(id).subscribe(
      data => {
        if( data['msg'] === "OK"){
          this.event = data['object'];

          /*let dates = [];
          this.event.dates.forEach( d => {
            dates.push({date: new Date(Date.parse(d.date)), startTime: d.startTime, endTime: d.endTime});
          });

          this.event.dates = dates;*/
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
