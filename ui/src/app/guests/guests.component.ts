import {Component, OnInit, ViewChild} from '@angular/core';
import {switchMap} from "rxjs/operators";
import {SuggestingItemInputComponent} from "../suggesting-item-input/suggesting-item-input.component";
import {ContactsModalComponent} from "../contacts-modal/contacts-modal.component";
import {AddAttendeeComponent} from "../add-attendee/add-attendee.component";
import {AlertService} from "../alert.service";
import {CommonService} from "../utils/common.service";
import {DateService} from "../utils/date.service";
import {DataService} from "../utils/data.service";

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})
export class GuestsComponent implements OnInit {
  @ViewChild('selectGuest') selectGuest: SuggestingItemInputComponent;
  @ViewChild('contactsModal') contactsModal: ContactsModalComponent;
  @ViewChild('addAttendee') addAttendee: AddAttendeeComponent;

  constructor(private alertService: AlertService,
              private dataService: DataService,) { }

  guests: any[] = [];
  guestHint = '';
  attendees: any[] = [];

  ngOnInit(): void {
  }


  private validateForm() {
    return true;
  }

  onImportClick(event) {
    this.contactsModal.show();
    event.preventDefault();
  }

  removeContact($event, index) {
    this.attendees.splice(index, 1);
    event.preventDefault();
  }

  addGuests(event) {
    this.addAttendee.reset();
    this.addAttendee.show();
    event.preventDefault();
  }

  onGuestsSelected(guests) {
    guests.forEach( guest => {
      this.attendees = this.attendees.filter( a => {
        return guest.email !== a.email;
      });
      this.attendees.push(guest);
    });
  }

  onGuestAdded(guest: any) {

    if (guest.type === 'USER') {
      this.alertService.warn('همکاری با این ایمیل ثبت شده است.');
    }

    this.attendees = this.attendees.filter( a => {
      return guest.email !== a.email;
    });

    this.attendees.push(guest);
    this.guestHint = '';
  }

  onGuestInputKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {

      case 13: // Enter
      case 38: // Arrow Up
      case 40: // Arrow Down
        break;

      default:
        this.dataService.getUsers(this.guestHint)
          .pipe(switchMap( data => {
              if (data.msg === 'OK') {
                this.guests = data.object.map(
                  u => {
                    return u;
                  }
                );
              }
              return this.dataService.getContacts(this.guestHint);
            }
          ))
          .subscribe(
            data => {
              if (data.msg === 'OK') {
                const contacts = data.object.map(
                  u => {
                    return u;
                  }
                );
                this.guests = [...contacts, ...this.guests];
              }
            },
            error1 => {
              console.log(error1);
            }
          );
    }

    this.selectGuest.onKeyUp(event);
    event.preventDefault();
  }

  getGuests(){
    return this.guests;
  }

  getAttendees(){
    return this.attendees;
  }

}
