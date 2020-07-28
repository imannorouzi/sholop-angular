import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateService} from "../utils/date.service";
import {CommonService} from "../utils/common.service";
import {ReceptionService} from "../reception/reception.service";
import {NavigationService} from "../utils/navigation.service";
import {CommentsComponent} from "../comments/comments.component";

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class MeetingDetailsComponent implements OnInit, OnChanges  {
  @ViewChild("comments", {static: true}) comments: CommentsComponent;

  @Input() event;
  constructor(public dateService: DateService,
              public commonService: CommonService,
              public receptionService: ReceptionService,
              private navigationService: NavigationService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.event && changes.event.previousValue !== changes.event.currentValue){

      this.event.attendees.forEach(att => {
        att.status = this.getContactStatus(att.id);
      });
    }
  }

  getContactStatus(id: number) : any {
    let contactEvent = this.event.contactEvents.find(ce => { return ce.contactId === id} );
    let status = '';
    if(contactEvent){
      status = contactEvent.status;
    }

    return this.commonService.getContactStatus(status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.event.id);
  }

  reception(contact: any) {
    this.receptionService.receptionItemClick.next({event: this.event, contact: contact});
  }
}
