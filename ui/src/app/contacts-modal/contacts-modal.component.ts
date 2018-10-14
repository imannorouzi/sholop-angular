import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../ng-modal/modal.component";
import {DataService} from "../data.service";

@Component({
  selector: 'contacts-modal',
  templateUrl: './contacts-modal.component.html',
  styleUrls: ['./contacts-modal.component.css']
})
export class ContactsModalComponent implements OnInit {
  @ViewChild('selectContacts') selectContacts: ModalComponent;

  @Output() onSelected: EventEmitter<any> = new EventEmitter();

  contacts: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.readContacts();
  }

  readContacts(){

    this.dataService.getContacts(1).subscribe(
      data => {
        data.object.forEach( contact => {
          this.contacts.push(contact);
        });
      },
      error1 => {
        console.log(error1);
      }
    )
  }

  show(){
    this.selectContacts.show();
  }

  onSubmit(){
    let selectedContacts = [];
    this.contacts.forEach(contact => {
      if(contact.selected) selectedContacts.push(contact);
    });

    this.onSelected.emit(selectedContacts);
    this.selectContacts.hide();
  }

}
