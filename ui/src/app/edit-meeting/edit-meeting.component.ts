import {Component, OnInit} from '@angular/core';
import {DateService} from "../date.service";
import {UtilService} from "../util.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css']
})
export class EditMeetingComponent implements OnInit {

  event: any;
  loading: boolean = false;


  constructor(public dateService: DateService,
              public utilService: UtilService,
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
