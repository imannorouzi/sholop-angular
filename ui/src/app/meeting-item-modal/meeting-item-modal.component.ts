import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateService} from "../utils/date.service";
import {CommentsComponent} from "../comments/comments.component";
import {NavigationService} from "../utils/navigation.service";
import {CommonService} from "../utils/common.service";
import {ReceptionService} from "../reception/reception.service";
import {ModalComponent} from "../common-components/ng-modal/modal.component";

@Component({
  selector: 'meeting-item-modal',
  templateUrl: './meeting-item-modal.component.html',
  styleUrls: ['./meeting-item-modal.component.css']
})
export class MeetingItemModalComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('childModal', {static: true}) public childModal: ModalComponent;
  @ViewChild("comments", {static: true}) comments: CommentsComponent;
  @Input() event: any;

  constructor(public dateService: DateService,
              public commonService: CommonService,
              public receptionService: ReceptionService,
              private navigationService: NavigationService) {
  }


  ngAfterViewInit(): void {
    // this.comments.reset();
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

    return this.commonService.getContactStatus(status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.event.id);
  }

  reception(contact: any) {
    this.receptionService.receptionItemClick.next({event: this.event, contact: contact});
    this.hide();
  }
}
