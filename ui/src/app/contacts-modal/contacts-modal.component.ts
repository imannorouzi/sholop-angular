import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataService} from "../utils/data.service";
import {DummyData} from "../dummyData";
import {ModalComponent} from "../common-components/ng-modal/modal.component";
import {GuestListComponent} from "./guest-list/guest-list.component";

@Component({
  selector: 'contacts-modal',
  templateUrl: './contacts-modal.component.html',
  styleUrls: ['./contacts-modal.component.css']
})
export class ContactsModalComponent implements OnInit {
  @ViewChild('selectContacts', {static: true}) public selectContacts: ModalComponent;
  @ViewChild('contacts', {static: true}) public contacts: GuestListComponent;
  @ViewChild('users', {static: true}) public users: GuestListComponent;

  @Output() onSelected: EventEmitter<any> = new EventEmitter();

  tab: number = 1;

  constructor() { }

  ngOnInit() {
  }


  show(){
    this.selectContacts.show();
  }

  hide(){
    this.selectContacts.hide();
  }

  onSubmit(){
    let contacts = this.contacts.getSelectedItems().filter( c => {
      return c;
    });
    let users = this.users.getSelectedItems().filter( c => {
      return c;
    })
    let selectedContacts = [...contacts, ...users];

    this.onSelected.emit(selectedContacts);
    this.selectContacts.hide();
  }

}
