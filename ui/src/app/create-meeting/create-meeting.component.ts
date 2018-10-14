import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {} from '@types/googlemaps';
import {DateTime} from "../date-time";
import {Venue} from "../venue";
import { DataService } from "../data.service";
import {Bounds, CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {ModalComponent} from "../ng-modal/modal.component";
import {NavigationService} from "../navigation.service";


@Component({
  selector: 'create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap') gmapElement: any;
  @ViewChild('searchBox') searchInput: ElementRef;
  @ViewChild('address2') address2: ElementRef;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', undefined) imageCropperModal:ModalComponent;
  @ViewChild('contactsModal', undefined) contactsModal:ModalComponent;
  @ViewChild('fileInput') fileInput: ElementRef;

  name:string;

  constructor(private dataService : DataService,
              private navigationService: NavigationService) {

  }

  times : string[] = [];
  map : google.maps.Map;
  markers : google.maps.Marker[] = [];
  venue : Venue;
  event = {
    times: [],
    contacts: [],
    title: '',
    venue: this.venue,
    image: File,
    userId: -1
  };
  submitting: boolean = false;

  ngOnInit() {
    for(var h=0; h<24; h++){
      for(var m=0; m<12; m++){
        this.times.push(( h<10? '0'+h : h)+":"+( m<2 ? '0' + (m*5) : (m*5) ) );
      }
    }

    this.event.times.push(new DateTime());
    this.event.contacts.push({name: '', email: '', phone:''})
  }

  ngAfterViewInit(): void {
    let mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    let map = this.map;
    let searchInput = this.searchInput.nativeElement;

    let searchBox = new google.maps.places.SearchBox(searchInput);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    //Init markers
    let scope = this;

    let handleMap = function(){
      let places = searchBox.getPlaces();

      if (places.length == 0) return;

      // Clear out the old markers.
      scope.markers.forEach(function(marker) {marker.setMap(null);});
      scope.markers = [];

      // For each place, get the icon, name and location.
      let bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        let icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        scope.markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);

    }
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', handleMap);
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
        this.event.venue = new Venue(
          -1,
          "",
          this.markers[0].getPosition().lat(),
          this.markers[0].getPosition().lng(),
          this.searchInput.nativeElement.value,
          this.address2.nativeElement.value,
          this.map['mapUrl']
        );
      }

      this.submitting = true;
      this.dataService.postTinyEvent(this.event).subscribe(
        (value:any) => {
          // console.log(value);
          this.submitting = false;
          this.navigationService.navigate("/");
          alert('slsl');
        },
        (error:any) => {
          console.log(error);
          this.submitting = false;
        });
    }
  }

  onImportClick($event) {
    this.contactsModal.show();
    event.preventDefault();
  }
  addContact($event) {
    this.event.contacts.push({name:'', email:'', phone:''});
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

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
