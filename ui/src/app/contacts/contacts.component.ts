import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";
import {User} from "../user";
import {first} from "rxjs/operators";
import {UserService} from "../user.service";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: any[] = [];

  currentUser: User;
  users: User[] = [];

  constructor(private dataService: DataService,
              private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.readContacts();
    this.loadAllUsers();
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

  deleteUser(id: number) {
    this.userService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllUsers()
    });
  }

  private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }


}
