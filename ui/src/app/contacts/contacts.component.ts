import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../utils/data.service";
import {User} from "../user";
import {SpinnerComponent} from "../spinner/spinner.component";
import {ConfirmComponent} from "../common-components/confirm/confirm.component";
import {AddContactComponent} from "../add-contact/add-contact.component";
import {ActivatedRoute} from "@angular/router";
import {CommonService} from "../utils/common.service";
import {AlertService} from "../alert.service";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  @ViewChild("spinner", {static: true}) spinner: SpinnerComponent;
  @ViewChild("confirm", {static: true}) confirm: ConfirmComponent;
  @ViewChild("editContact", {static: true}) addContact: AddContactComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;

  contacts: any[] = [];
  deletingContact: any;
  loading: boolean = false;

  currentUser: User;
  searchString: string = '';

  constructor(private dataService: DataService,
              public commonService: CommonService,
              private route: ActivatedRoute,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.readContacts('');
    });
  }

  readContacts(hint: string){

    this.loading = true;

    this.dataService.getContacts(hint).subscribe(
      data => {
        if(data.msg === "OK") {

          this.contacts = [];

          data.object.forEach(contact => {

            if(contact.imageUrl && this.commonService.getBase()){
              contact.imageUrl = this.commonService.getBase() + contact.imageUrl;
            }
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

  onContactAdded(contact){
    if(contact.type === 'USER'){
      this.alertService.error('همکاری با این ایمیل ثبت شده است.');
    }else {
      let c = this.contacts.find(c => {
        return c.id === contact.id
      });
      if (c) {
        let i = this.contacts.indexOf(c);
        this.contacts.splice(i, 1);
        this.contacts.splice(i, 0, contact);
      } else {
        this.contacts.push(contact);
      }
    }
  }

  onDeleteUser(id: any, index: number, event) {
    event.preventDefault();
    this.deletingContact = this.contacts[index];
    this.confirm.setObject({id: id, index: index});
    this.confirm.show();
  }

  onEditContact(contact: any, index: number) {
    event.preventDefault();
    this.addContact.setContact(contact, index);
    this.addContact.show();
  }

  onKeyUp(event){
    this.readContacts(this.searchString)
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
