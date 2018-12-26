import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, Input} from '@angular/core';
import {DateTime} from "../date-time";
import {Venue} from "../venue";
import { DataService } from "../data.service";
import {Bounds, CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {ModalComponent} from "../ng-modal/modal.component";
import {NavigationService} from "../navigation.service";
import {AddAttendeeComponent} from "../add-attendee/add-attendee.component";
import {AuthenticationService} from "../authentication.service";
import {AlertService} from "../alert.service";
import {MapsAPILoader} from "@agm/core";
import {DateService} from "../date.service";


@Component({
  selector: 'editable-meeting',
  templateUrl: './editable-meeting.component.html',
  styleUrls: ['./editable-meeting.component.css']
})
export class EditableMeetingComponent implements OnInit, AfterViewInit {
  // @ViewChild('gmap') gmapElement: any;
  @ViewChild('searchBox') searchInput: ElementRef;
  @ViewChild('address2') address2: ElementRef;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', undefined) imageCropperModal:ModalComponent;
  @ViewChild('contactsModal', undefined) contactsModal:ModalComponent;
  @ViewChild('venuesModal', undefined) venuesModal:ModalComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('addAttendee') addAttendee: AddAttendeeComponent;

  name:string;

  constructor(private dataService : DataService,
              private navigationService: NavigationService,
              private authenticationService: AuthenticationService,
              private alertService: AlertService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              private dateService: DateService){
  }

  public latitude: number;
  public longitude: number;
  public zoom: number;

  times : string[] = [];

  venue : Venue = new Venue();
  @Input() event = {
    times: [],
    contacts: [],
    title: '',
    venue: this.venue,
    userId: -1,
    welcomeMessage: "",
    eventType: "MEETING",
  };

  submitting: boolean = false;

  ngOnInit() {

    //set google maps defaults
    this.zoom = 4;
    this.latitude = 18.5793;
    this.longitude = 73.8143;

    //set current position
    this.setCurrentPosition();

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
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });


    for(let h=0; h<24; h++){
      for(let m=0; m<12; m++){
        this.times.push(( h<10? '0'+h : h)+":"+( m<2 ? '0' + (m*5) : (m*5) ) );
      }
    }

    this.event.times.push(new DateTime());
    // this.event.contacts.push({name: '', email: '', phone:''})
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  ngAfterViewInit(): void {
  }

  addDateTime(event) {
    this.event.times.push(new DateTime());
    event.preventDefault();
  }

  onDateSelected(index, event){
    this.event.times[index].setDate(event);
  }

  removeDateTime($event, index) {
    this.event.times.splice(index, 1);
    event.preventDefault();
  }

  private validateForm() {
    return true;
  }

  onSubmit(){
    if(this.validateForm()) {
      if (!this.event.venue) {
        // this.event.userId = this.authenticationService.getUser().id;
        this.event.venue = new Venue(
          -1,
          "",
          this.latitude,
          this.longitude,
          this.searchInput.nativeElement.value,
          this.address2.nativeElement.value,
          // this.map['mapUrl']
        );
      }

      this.submitting = true;
      this.dataService.postMeeting(this.event).subscribe(
        (value:any) => {
          // console.log(value);
          this.submitting = false;
          this.navigationService.navigate("/dashboard");

          this.alertService.success("Meeting created successfully.");
        },
        (error:any) => {
          console.log(error);
          this.submitting = false;
        });
    }
  }

  onImportClick(event) {
    this.contactsModal.show();
    event.preventDefault();
  }
  addContact(event) {
    this.addAttendee.reset();
    this.addAttendee.show();
    event.preventDefault();
  }
  removeContact($event, index) {
    this.event.contacts.splice(index, 1);
    event.preventDefault();
  }

  onContactsSelected(contacts) {
    contacts.forEach( contact => {
      this.event.contacts.push(contact);
    })
  }

  onVenueImportClick(event) {
    this.venuesModal.show();
    event.preventDefault();

  }

  onVenueSelected(venue: any) {
    this.event.venue = venue;
    this.latitude = venue.latitude;
    this.longitude = venue.longitude;

  }

  onAttendeeAdded(contact: any) {
    this.event.contacts.push(contact);
  }

  fromTimeChanged(event, i) {
    this.event.times[i].from = event;
  }

  toTimeChanged(event, i) {
    this.event.times[i].to = event;
  }

  chairSelected(contact: any) {
    this.event.userId = contact.id;
  }

  markerMoved(e) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': e.coords}, (res, status) => {
      if (status === google.maps.GeocoderStatus.OK && res.length) { this.ngZone.run(() => this.setLocation(res[0])); }
    })
  }

  setLocation(place) { this.latitude = place.geometry.location.lat(); this.longitude = place.geometry.location.lng(); }

}
