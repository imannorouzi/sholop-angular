import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
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
  @ViewChild('childModal') public childModal:ModalDirective;
  @ViewChild("comments") comments: CommentsComponent;

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



    }
  }


  getContactStatus(id: number) {
    let contact = this.event.attendees.find(contact => { return contact.id === id} );
    return this.utilService.getContactStatus(contact.status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.event.id);
  }
}
