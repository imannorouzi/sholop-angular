import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {User} from "../user";
import {SpinnerComponent} from "../spinner/spinner.component";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  @ViewChild("spinner") spinner: SpinnerComponent;

  contacts: any[] = [];

  currentUser: User;
  searchString: string = '';

  constructor(private dataService: DataService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.readContacts('');
    // this.loadAllUsers();
  }

  readContacts(hint: string){

    this.spinner.show();


    this.dataService.getContacts(hint).subscribe(
      data => {
        if(data.msg === "OK") {

          this.contacts = [];

          data.object.forEach(contact => {
            this.contacts.push(contact);
          });
        }

        this.spinner.hide();
      },
      error1 => {
        console.log(error1);
        this.spinner.hide();
      }
    )
  }

  deleteContact(id: number, index: number) {
    this.dataService.deleteContact(id).subscribe(
      data => {
        this.contacts.splice(index, 1);
      },
      error1 => {
        console.log(error1);
        this.spinner.hide();
      }
    )
  }

  /*private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }*/

  onContactAdded(contact){
    this.contacts.push(contact);
  }

  onDeleteUser(id: any, index: number, event) {
    event.preventDefault();
    this.deleteContact(id, index);
  }

  onKeyUp(event){
    this.readContacts(this.searchString)
  }
}
