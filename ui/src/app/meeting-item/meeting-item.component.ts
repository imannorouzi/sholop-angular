import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateService} from "../utils/date.service";
import {User} from "../user";
import {DataService} from "../utils/data.service";
import {CommonService} from "../utils/common.service";
import {AuthService} from "../utils/auth.service";

@Component({
  selector: 'meeting-item',
  templateUrl: './meeting-item.component.html',
  styleUrls: ['./meeting-item.component.css']
})
export class MeetingItemComponent implements OnInit {

  @Input() event: any;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
  user: User;

  attendeesString: string;

  constructor(public dateService: DateService,
              public commonService: CommonService,
              private dataService: DataService,
              private authService: AuthService) {
  }

  ngOnInit() {
    if(this.event.attendees.length === 1){
      this.attendeesString = this.event.attendees[0].name;
    }else if(this.event.attendees.length === 2){
      this.attendeesString = this.event.attendees[0].name + '، ' + this.event.attendees[1].name;
    }else if(this.event.attendees.length > 2){
      this.attendeesString = this.event.attendees[0].name + ' و ' + (this.event.attendees.length - 1) + ' میهمان دیگر';
    }

    this.user = this.authService.getCurrentUser();

  }

  onClicked(e, event){
    this.clicked.emit(event);
  }

  updateAttendingStatus(id, status: string) {
    this.dataService.updateContactStatus(id, status).subscribe(
      data => {
        if(data['msg']==="OK"){
          this.event.contactEvent = data['object'];
          this.event.attendees.forEach(att => {
            if(att.email === this.user.username){
              att.status = this.commonService.getContactStatus(this.event.contactEvent.status);
            }
          })
        }
      },
      error1 => {
        console.log(error1);
      }
    )
  }
}
