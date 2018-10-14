import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

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

}
