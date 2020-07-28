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
export class MeetingItemModalComponent implements OnInit{
  @ViewChild('childModal', {static: true}) public childModal: ModalComponent;
  @Input() event: any;

  constructor(private receptionService: ReceptionService) {
  }


  ngOnInit() {
    this.receptionService.receptionItemClick
      .subscribe( () => {
        this.hide();
      })
  }

  show(){
    this.childModal.show();
  }

  hide(){
    this.childModal.hide();
  }

}
