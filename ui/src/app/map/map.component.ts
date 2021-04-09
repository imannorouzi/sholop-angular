import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {TEHRAN, Venue} from "../venue";
import {ModalComponent} from "../common-components/ng-modal/modal.component";
import { MapsAPILoader} from "@agm/core";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('venuesModal') venuesModal: ModalComponent;
  @ViewChild('searchBox') searchInput: ElementRef;
  @ViewChild('address2') address2: ElementRef;

  mapLat: number = TEHRAN.lat;
  mapLng: number = TEHRAN.lng;
  public zoom: number = 12;
  map: any;

  venue = new Venue();
  constructor(private ngZone: NgZone,
              private mapsAPILoader: MapsAPILoader,) { }

  ngOnInit(): void {

    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.venue.latitude = place.geometry.location.lat();
          this.venue.longitude = place.geometry.location.lng();
          this.zoom = 12;

          this.mapLat = place.geometry.location.lat();
          this.mapLng = place.geometry.location.lng();
        });
      });

    });
  }

  private setCurrentPosition() {
    if ( (!this.venue || this.venue.id <= 0) && false && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.venue.latitude = position.coords.latitude;
        this.venue.longitude = position.coords.longitude;
        this.mapLat = position.coords.latitude;
        this.mapLng = position.coords.longitude;

      });
    }else {
      this.mapLat = this.venue.latitude;
      this.mapLng = this.venue.longitude;
    }
  }

  onVenueImportClick(event) {
    this.venuesModal.show();
    event.preventDefault();

  }

  mapMoved(e) {
    this.venue.latitude = e.lat;
    this.venue.longitude = e.lng;
  }

  mapClicked(e) {
    if (this.map) {
      this.map.setCenter({lat: e.coords.lat, lng: e.coords.lng});
    }

    this.venue.latitude = e.coords.lat;
    this.venue.longitude = e.coords.lng;

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': e.coords}, (res, status) => {
      if (status === google.maps.GeocoderStatus.OK && res.length) {
        this.ngZone.run(() => this.venue.farsiAddress1 = res[0].formatted_address);
      }
    });
  }

  onVenueSelected(venue: any) {
    this.venue = venue;
    this.mapLat = venue.latitude;
    this.mapLng = venue.longitude;
  }


  getVenue() {
    return this.venue;
  }

  mapReady($event: any) {
    this.map = $event;

    this.map.addListener("dragend", () => {
      const geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': {lat: this.venue.latitude, lng: this.venue.longitude}}, (res, status) => {
        if (status === google.maps.GeocoderStatus.OK && res.length) {
          this.ngZone.run(() => this.venue.farsiAddress1 = res[0].formatted_address);
        }
      });
    });


      this.setCurrentPosition();
  }
}
