import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateService} from "../utils/date.service";
import {NavigationService} from "../utils/navigation.service";
import {ReceptionService} from "../reception/reception.service";
import {CommonService} from "../utils/common.service";
import {ModalComponent} from "../ng-modal/modal.component";

@Component({
  selector: 'reception-item-modal',
  templateUrl: './reception-item-modal.component.html',
  styleUrls: ['./reception-item-modal.component.css']
})
export class ReceptionItemModalComponent implements OnInit, OnChanges {
  @ViewChild('childModal', {static: true}) public childModal: ModalComponent;

  @Input() item: any = {
    event: undefined,
    contact: undefined
  };

  constructor(public dateService: DateService,
              private receptionService: ReceptionService,
              public commonService: CommonService,
              private navigationService: NavigationService) {

    this.receptionService.receptionItemClick.subscribe(
      item => {
        this.item = item;
        this.show();
      }
    )
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
    if(this.item && changes.event.previousValue !== changes.event.currentValue){

      this.item.event.attendees.forEach(att => {
        att.status = this.getContactStatus(att.id);
      });

    }
  }


  getContactStatus(id: number) : any {
    let contactEvent = this.item.event.contactEvents.find(ce => { return ce.contactId === id} );
    let status = '';
    if(contactEvent){
      status = contactEvent.status;
    }

    return this.commonService.getContactStatus(status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.item.event.id);
  }
}
