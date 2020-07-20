import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../ng-modal/modal.component";

@Component({
  selector: 'confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  @ViewChild('childModal', {static: true}) public childModal: ModalComponent;

  @Input() object: any;
  @Input() message: any = "";
  @Input() title: any = "";
  @Input() type: string = "CONFIRM"; // or PROMPT
  @Output() confirmed: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  show(){
    this.childModal.show();
  }

  setObject(object){
    this.object = object;
  }

  hide(){
    this.childModal.hide();
  }

  ngOnInit() {
  }

  confirm() {
    this.confirmed.emit(this.object);
    this.hide();
  }
}
