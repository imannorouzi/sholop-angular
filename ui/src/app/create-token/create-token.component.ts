import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, Input} from '@angular/core';
import {DateTime} from "../date-time";
import {Venue} from "../venue";
import { DataService } from "../utils/data.service";
import {ImageCropperComponent} from "ng2-img-cropper";
import {ModalComponent} from "../ng-modal/modal.component";
import {NavigationService} from "../utils/navigation.service";
import {AddAttendeeComponent} from "../add-attendee/add-attendee.component";
import {AlertService} from "../alert.service";
import {MapsAPILoader} from "@agm/core";
import {DateService} from "../utils/date.service";
import {ContactsModalComponent} from "../contacts-modal/contacts-modal.component";
import {AuthService} from "../utils/auth.service";

@Component({
  selector: 'create-meeting',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.css']
})
export class CreateTokenComponent implements OnInit {

  @ViewChild('searchBox', {static: false}) searchInput: ElementRef;
  @ViewChild('address2', {static: false}) address2: ElementRef;
  @ViewChild('cropper', {static: true}) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal:ModalComponent;
  @ViewChild('contactsModal', {static: false}) contactsModal: ContactsModalComponent;
  @ViewChild('venuesModal', {static: false}) venuesModal:ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('addAttendee', {static: false}) addAttendee: AddAttendeeComponent;

  name:string;

  constructor(private dataService : DataService,
              private navigationService: NavigationService,
              private authService: AuthService,
              private alertService: AlertService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public dateService: DateService){
  }

  public zoom: number;

  times : string[] = [];
  event = {
    userId: -1,
    attendees: [],
    venue: new Venue(),
    chairId: -1,
    chair: undefined,
    eventType: "TOKEN",
    oneTime: true
  };

  user: any;

  submitting: boolean = false;

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  private validateForm() {
    return true;
  }

  onSubmit(){
    if(this.validateForm()) {

      this.submitting = true;
      this.dataService.postMeeting(this.event).subscribe(
        (value:any) => {
          this.submitting = false;
          this.navigationService.navigate("/meetings");

          this.alertService.success("توکن با موفقیت ایجاد شد.");
        },
        (error:any) => {
          console.log(error);
          this.submitting = false;
        });
    }
  }

  onImportClick(event) {
    this.contactsModal.show();
    // this.contactsModal.setSelected(this.event.attendees);
    event.preventDefault();
  }
  addContact(event) {
    this.addAttendee.reset();
    this.addAttendee.show();
    event.preventDefault();
  }
  removeContact($event, index) {
    this.event.attendees.splice(index, 1);
    event.preventDefault();
  }

  onContactsSelected(contacts) {

    contacts.forEach( contact => {
      for(let i=0; i<this.event.attendees.length; i++){
        if(this.event.attendees[i].id === contact.id){
          this.event.attendees.splice(i, 1);
          break;
        }
      }
      this.event.attendees.push(contact);
    })
  }

  onVenueImportClick(event) {
    this.venuesModal.show();
    event.preventDefault();

  }

  onVenueSelected(venue: any) {
    this.event.venue = venue;
  }

  onAttendeeAdded(contact: any) {
    this.event.attendees.push(contact);
  }


  chairSelected(contact: any) {
    this.event.userId = contact.id;
    this.event.chair = contact;
  }
}
