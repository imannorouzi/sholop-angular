import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {User} from "../user";
import {SpinnerComponent} from "../spinner/spinner.component";
import {ConfirmComponent} from "../confirm/confirm.component";
import {AddContactComponent} from "../add-contact/add-contact.component";
import {UtilService} from "../util.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  @ViewChild("spinner") spinner: SpinnerComponent;
  @ViewChild("confirm") confirm: ConfirmComponent;
  @ViewChild("editContact") addContact: AddContactComponent;
  @ViewChild('fileInput') fileInput: ElementRef;

  contacts: any[] = [];
  loading: boolean = false;

  currentUser: User;
  searchString: string = '';
  type: string = 'contact';

  constructor(private dataService: DataService,
              public utilService: UtilService,
              private route: ActivatedRoute,) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    // this.readContacts('');
    // this.loadAllUsers();
    this.route.params.subscribe(params => {
      this.type = params['type'];
      this.readContacts('', params['type']);
    });
  }

  readContacts(hint: string, type: string){

    this.loading = true;

    this.dataService.getContacts(hint, type).subscribe(
      data => {
        if(data.msg === "OK") {

          this.contacts = [];

          data.object.forEach(contact => {
            this.contacts.push(contact);
          });
        }

        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    )
  }

  deleteConfirmed(contact){
    this.dataService.deleteContact(contact.id).subscribe(
      data => {
        this.contacts.splice(contact.index, 1);
      },
      error1 => {
        console.log(error1);
      }
    )
  }

  /*private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }*/

  onContactAdded(contact){
    let c = this.contacts.find( c => { return c.id === contact.id});
    if(c){
      let i = this.contacts.indexOf(c);
      this.contacts.splice(i, 1);
      this.contacts.splice(i, 0, contact);
    }else{
      this.contacts.push(contact);
    }
  }

  onDeleteUser(id: any, index: number, event) {
    event.preventDefault();
    this.confirm.setObject({id: id, index: index});
    this.confirm.show();
  }

  onEditContact(contact: any, index: number) {
    event.preventDefault();
    this.addContact.setContact(contact, index);
    this.addContact.show();
  }

  onKeyUp(event){
    this.readContacts(this.searchString, this.type)
  }

  onUploadFileClick(event) {
    event.preventDefault();
    this.fileInput.nativeElement.click();
  }

  fileChanged($event){
    let file = $event.target.files[0];
    if(file){
    }
  }
}
