import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, Input} from '@angular/core';
import {TEHRAN, Venue} from "../venue";
import { DataService } from "../utils/data.service";
import {ModalComponent} from "../common-components/ng-modal/modal.component";
import {NavigationService} from "../utils/navigation.service";
import {AddAttendeeComponent} from "../add-attendee/add-attendee.component";
import {AlertService} from "../alert.service";
import {MapsAPILoader} from "@agm/core";
import {DateService} from "../utils/date.service";
import {ContactsModalComponent} from "../contacts-modal/contacts-modal.component";
import {AuthService} from "../utils/auth.service";
import {SuggestingItemInputComponent} from "../suggesting-item-input/suggesting-item-input.component";
import { switchMap} from "rxjs/operators";
import {ImageCropperComponent} from "ngx-image-cropper";

@Component({
  selector: 'create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit, AfterViewInit {

  @ViewChild('searchBox') searchInput: ElementRef;
  @ViewChild('address2') address2: ElementRef;
  @ViewChild('cropper', {static: true}) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal:ModalComponent;
  @ViewChild('contactsModal') contactsModal: ContactsModalComponent;
  @ViewChild('venuesModal') venuesModal:ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('addAttendee') addAttendee: AddAttendeeComponent;
  @ViewChild('selectChair') selectChair: SuggestingItemInputComponent;
  @ViewChild('selectGuest') selectGuest: SuggestingItemInputComponent;

  name:string;
  step: number =0;
  editingStep: number = -1;

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
    dates: [],
    dateStrings: [],
    attendees: [],
    title: '',
    venue: new Venue(),
    chairId: -1,
    chair: this.authService.getCurrentUser(),
    welcomeMessage: "",
    eventType: "MEETING",
    imChair: true
  };
  mapLat: number = TEHRAN.lat;
  mapLng: number = TEHRAN.lng;

  guests: any[];
  guestHint: string = '';

  chairs: any[];
  chairHint: string = this.authService.name;
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

    let d = new Date(); d.setHours(0,0,0,0);
    this.event.dates.push({date: d, startTime: new Date(), endTime: new Date()});
    for(let h=0; h<24; h++){
      for(let m=0; m<12; m++){
        this.times.push(( h<10? '0'+h : h)+":"+( m<2 ? '0' + (m*5) : (m*5) ) );
      }
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

          this.mapLat = place.geometry.location.lat();
          this.mapLng = place.geometry.location.lng();
        });
      });
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.event.venue.latitude = position.coords.latitude;
        this.event.venue.longitude = position.coords.longitude;
        this.zoom = 12;

        this.mapLat = position.coords.latitude;
        this.mapLng = position.coords.longitude;

      });
    }
  }

  addDateTime(event) {
    let d = new Date();

    let date = new Date(d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );

    this.event.dates.push({date: date, startTime: new Date(), endTime: new Date()});
    event.preventDefault();
  }

  onDateSelected(index, event){
    this.event.dates[index].date = event;
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

      // take times to utc format
      if(this.event.dates) {
        this.event.dateStrings = this.event.dates.map(d => {
          return {
            date: d.date.toISOString(),
            startTime: d.startTime.toISOString(),
            endTime: d.endTime.toISOString(),
            dateString: this.dateService.getPersianDateString(d.date, d.startTime, d.endTime)
          };
        })
      }

      this.submitting = true;
      this.dataService.postMeeting(this.event).subscribe(
        (res:any) => {
          if(res && res.msg === 'OK'){
            this.navigationService.navigate("/meetings");
            this.alertService.success("ملاقات با موفقیت ایجاد شد.");
          }else{
            this.alertService.error("ببخشید، مشکلی پیش آمد. دوباره تلاش کنید.");
          }
          this.submitting = false;

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

  removeContact($event, index) {
    this.event.attendees.splice(index, 1);
    event.preventDefault();
  }

  addGuests(event) {
    this.addAttendee.reset();
    this.addAttendee.show();
    event.preventDefault();
  }

  onGuestsSelected(guests) {
    guests.forEach( guest => {
      this.event.attendees = this.event.attendees.filter( a => {
        return guest.email !== a.email
      });
      this.event.attendees.push(guest);
    })
  }

  onGuestAdded(guest: any) {

    if(guest.type === 'USER'){
      this.alertService.warn('همکاری با این ایمیل ثبت شده است.');
    }

     this.event.attendees = this.event.attendees.filter( a => {
      return guest.email !== a.email
    });

     this.event.attendees.push(guest);
     this.guestHint = '';
  }

  onVenueImportClick(event) {
    this.venuesModal.show();
    event.preventDefault();

  }



  onVenueSelected(venue: any) {
    this.event.venue = venue;
    this.mapLat = venue.latitude;
    this.mapLng = venue.longitude;
  }



  fromTimeChanged(dateObj, i) {
    this.event.dates[i].startTime = dateObj;
  }

  toTimeChanged(event, i) {
    this.event.dates[i].endTime = event;
  }

  chairSelected(chair: any) {
    if(chair){
      this.event.chair = chair;
      this.event.userId = chair.id;
      this.chairHint = chair.name;
    }
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

  mapClicked(e) {

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

  ngAfterViewInit(): void {

  }

  onChairInputKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {

      case 13: // Enter
      case 38: // Arrow Up
      case 40: // Arrow Down
        break;

      default:
        this.clearChair();
        this.dataService.getContacts(this.chairHint)
          .subscribe(
            data => {
              if(data.msg === "OK"){
                this.chairs = data.object;
              }
            },
            error1 => {
              console.log(error1);
            }
          )
    }

    this.selectChair.onKeyUp(event);
    event.preventDefault();
  }

  onGuestInputKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {

      case 13: // Enter
      case 38: // Arrow Up
      case 40: // Arrow Down
        break;

      default:
        this.dataService.getUsers(this.guestHint)
          .pipe(switchMap( data =>{
              if(data.msg === "OK"){
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
              if(data.msg === "OK"){
                let contacts = data.object.map(
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
          )
    }

    this.selectGuest.onKeyUp(event);
    event.preventDefault();
  }

  clearChairInput() {
    this.clearChair();
    this.chairHint = '';
  }

  clearChair(){
    this.event.chair = undefined;
  }
}
