import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateService} from "../date.service";
import {CommentsComponent} from "../comments/comments.component";
import {ModalDirective} from "ngx-bootstrap";
import {UtilService} from "../util.service";
import {NavigationService} from "../navigation.service";

@Component({
  selector: 'meeting-item-modal',
  templateUrl: './meeting-item-modal.component.html',
  styleUrls: ['./meeting-item-modal.component.css']
})
export class MeetingItemModalComponent implements OnInit, OnChanges {
  @ViewChild('childModal', {static: true}) public childModal:ModalDirective;
  @ViewChild("comments", {static: true}) comments: CommentsComponent;

  @Input() event: any;


  constructor(public dateService: DateService,
              public utilService: UtilService,
              private navigationService: NavigationService) {
  }

  show(){
    this.childModal.show();

  }

  hide(){
    this.childModal.hide();
  }

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

    return this.utilService.getContactStatus(status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.event.id);
  }
}
