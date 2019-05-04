import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateService} from "../date.service";
import {UtilService} from "../util.service";
import {User} from "../user";
import {AuthenticationService} from "../authentication.service";
import {DataService} from "../data.service";

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
              public utilService: UtilService,
              private authenticationService: AuthenticationService,
              private dataService: DataService) {
  }

  ngOnInit() {
    if(this.event.attendees.length === 1){
      this.attendeesString = this.event.attendees[0].name;
    }else if(this.event.attendees.length === 2){
      this.attendeesString = this.event.attendees[0].name + '، ' + this.event.attendees[1].name;
    }else if(this.event.attendees.length > 2){
      this.attendeesString = this.event.attendees[0].name + ' و ' + (this.event.attendees.length - 1) + ' میهمان دیگر';
    }

    this.user = this.authenticationService.getUser();

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
              att.status = this.utilService.getContactStatus(this.event.contactEvent.status);
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
