import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataService} from "../utils/data.service";
import {ModalDirective} from "ngx-bootstrap";
import {DummyData} from "../dummyData";

@Component({
  selector: 'contacts-modal',
  templateUrl: './contacts-modal.component.html',
  styleUrls: ['./contacts-modal.component.css']
})
export class ContactsModalComponent implements OnInit {
  @ViewChild('selectContacts', {static: true}) public selectContacts:ModalDirective;

  @Output() onSelected: EventEmitter<any> = new EventEmitter();

  contacts: any[] = [];
  loading: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.readDummyContacts();
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

  private readDummyContacts() {
    this.loading = true;

    setTimeout( () => {
      this.loading = false;
      this.contacts = DummyData.CONTACTS;
    }, 1500);

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

  selectAll(event){
    event.preventDefault();
    this.contacts.forEach( contact => {
      contact.selected = true;
    });
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
