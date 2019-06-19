import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../ng-modal/modal.component";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {DataService} from "../data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {AlertService} from "../alert.service";
import {AuthenticationService} from "../authentication.service";
import {ModalDirective} from "ngx-bootstrap";
import {Venue} from "../venue";
import {MapsAPILoader} from "@agm/core";

@Component({
  selector: 'add-venue',
  templateUrl: './add-venue.component.html',
  styleUrls: ['./add-venue.component.css']
})
export class AddVenueComponent implements OnInit {
  @ViewChild('childModal') public modal:ModalDirective;
  @ViewChild('spinner') spinner: SpinnerComponent;
  @ViewChild('searchBox') searchInput: ElementRef;
  @ViewChild('address2') address2: ElementRef;

  @Output() onVenueAdded: EventEmitter<any> = new EventEmitter();

  @Input() index: number = -1;
  @Input() venue = new Venue(
    -1,
    "",
    0,// lat
    0, // lng
    '',
    '',
    ''// this.map['mapUrl']
  );

  zoom = 12;

  submitted: boolean = false;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) {
  }

  ngOnInit() {

    //set current position
    if(!this.venue || this.venue.id <= 0){
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
          this.venue.latitude = place.geometry.location.lat();
          this.venue.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });

  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.venue.latitude = position.coords.latitude;
        this.venue.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }


  show(venue){
    if(venue) this.venue = venue;
    this.modal.show();
  }

  hide(){
    this.modal.hide();
  }

  reset(){
    this.venue.farsiAddress1 = "";
    this.venue.farsiAddress2 = "";
  }


  private validateForm() {
    return true;
  }

  createVenue(){

    this.submitted = true;
    if(!this.validateForm()) return;

      this.modal.hide();
      this.venue['userId'] = this.authenticationService.getUser().id;

      this.dataService.updateVenue(this.venue).subscribe(
        (value:any) => {
          this.onVenueAdded.emit(value.object);
        },
        (error:any) => {
          console.log(error);
          // this.spinner.hide();
          this.modal.show();
          this.alertService.error(error.toString())
        });
  }

  markerMoved(e) {

    this.venue.latitude = e.coords.lat;
    this.venue.longitude = e.coords.lng;

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': e.coords}, (res, status) => {
      if (status === google.maps.GeocoderStatus.OK && res.length) {
        this.ngZone.run(() => this.venue.farsiAddress1 = res[0].formatted_address);
      }
    })
  }
}
