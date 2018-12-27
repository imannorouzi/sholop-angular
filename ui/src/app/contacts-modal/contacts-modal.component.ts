import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'contacts-modal',
  templateUrl: './contacts-modal.component.html',
  styleUrls: ['./contacts-modal.component.css']
})
export class ContactsModalComponent implements OnInit {
  @ViewChild('selectContacts') public selectContacts:ModalDirective;

  @Output() onSelected: EventEmitter<any> = new EventEmitter();

  contacts: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.readContacts();
  }

  setSelected(list){

    list.forEach( sc => {
      this.contacts.forEach( contact => {
        if(sc.id === contact.id){
          contact.selected = true;
        }
      });
    });
  }

  readContacts(){

    this.dataService.getContacts().subscribe(
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

  hide(){
    this.selectContacts.hide();
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
