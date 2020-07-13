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
  selector: 'editable-meeting',
  templateUrl: './editable-meeting.component.html',
  styleUrls: ['./editable-meeting.component.css']
})
export class EditableMeetingComponent implements OnInit, AfterViewInit {
  // @ViewChild('gmap') gmapElement: any;
  @ViewChild('searchBox', {static: true}) searchInput: ElementRef;
  @ViewChild('address2', {static: true}) address2: ElementRef;
  @ViewChild('cropper', {static: true}) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal:ModalComponent;
  @ViewChild('contactsModal', {static: true}) contactsModal: ContactsModalComponent;
  @ViewChild('venuesModal', {static: true}) venuesModal:ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('addAttendee', {static: true}) addAttendee: AddAttendeeComponent;

  name:string;

  constructor(private dataService : DataService,
              private navigationService: NavigationService,
              private authService: AuthService,
              private alertService: AlertService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private dateService: DateService){
  }

  public zoom: number;

  times : string[] = [];

  @Input() event: any;
  user: any;

  submitting: boolean = false;

  ngOnInit() {

    this.user = this.authService.getCurrentUser();

    //set google maps defaults
    this.zoom = 12;
    // this.latitude = 18.5793;
    // this.longitude = 73.8143;

    //set current position
    if(!this.event.venue || this.event.venue.id <= 0){
      this.setCurrentPosition();
    }

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.event.venue.latitude = place.geometry.location.lat();
          this.event.venue.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });


    for(let h=0; h<24; h++){
      for(let m=0; m<12; m++){
        this.times.push(( h<10? '0'+h : h)+":"+( m<2 ? '0' + (m*5) : (m*5) ) );
      }
    }

    // this.event.times.push(new DateTime());
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.event.venue.latitude = position.coords.latitude;
        this.event.venue.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  ngAfterViewInit(): void {
  }

  addDateTime(event) {
    let d = new Date();

    let date = new Date(d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );

    this.event.dates.push({date: date, startTime: '0900', endTime: '1000'});
    event.preventDefault();
  }

  onDateSelected(index, event){
    this.event.dates[index].date = event;
    this.event.dates[index].dateString = this.dateService.greToPersian(event, true);
  }

  removeDateTime($event, index) {
    this.event.dates.splice(index, 1);
    event.preventDefault();
  }

  private validateForm() {
    return true;
  }

  onSubmit(){
    if(this.validateForm()) {
      if (this.event.venue && this.event.venue.id === 0) {
        // this.event.userId = this.authService.getUser().id;
        this.event.venue = new Venue(
          -1,
          "",
          this.event.venue.latitude,
          this.event.venue.longitude,
          this.searchInput.nativeElement.value,
          this.address2.nativeElement.value,
          ''// this.map['mapUrl']
        );
      }

      this.submitting = true;
      this.dataService.postMeeting(this.event).subscribe(
        (value:any) => {
          // console.log(value);
          this.submitting = false;
          this.navigationService.navigate("/meetings");

          this.alertService.success("ملاقات با موفقیت ایجاد شد.");
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

  fromTimeChanged(event, i) {
    this.event.dates[i].startTime = event;
  }

  toTimeChanged(event, i) {
    this.event.dates[i].endTime = event;
  }

  chairSelected(contact: any) {
    this.event.userId = contact.id;
  }

  markerMoved(e) {

    this.event.venue.latitude = e.coords.lat;
    this.event.venue.longitude = e.coords.lng;

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': e.coords}, (res, status) => {
      if (status === google.maps.GeocoderStatus.OK && res.length) {
        this.ngZone.run(() => this.event.venue.farsiAddress1 = res[0].formatted_address);
      }
    })
  }

  setLocation(place) {
    this.event.venue.latitude = place.geometry.location.lat();
    this.event.venue.longitude = place.geometry.location.lng();
  }

  goTo(url) {
    this.navigationService.navigate(url);
  }

}
