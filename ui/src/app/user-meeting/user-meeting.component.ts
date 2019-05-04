import {Component, OnInit, ViewChild} from '@angular/core';
import {DateService} from "../date.service";
import {UtilService} from "../util.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-user-meeting',
  templateUrl: './user-meeting.component.html',
  styleUrls: ['./user-meeting.component.css']
})
export class UserMeetingComponent implements OnInit {

  constructor(public dateService: DateService,
              public utilService: UtilService,
              private route: ActivatedRoute,
              private dataService: DataService) { }

  event: any;
  loading: boolean = false;

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
