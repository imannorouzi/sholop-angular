/// <reference types="@types/googlemaps" />

import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {DateTime} from '../date-time';
import {Venue} from '../venue';
import { DataService } from '../utils/data.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {ModalComponent} from '../common-components/ng-modal/modal.component';
import {NavigationService} from '../utils/navigation.service';
// import {} from 'googlemaps';
declare let google: any;

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap', {static: true}) gmapElement: any;
  @ViewChild('searchBox', {static: true}) searchInput: ElementRef;
  @ViewChild('address2', {static: true}) address2: ElementRef;
  @ViewChild('cropper', {static: true}) cropper: ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal: ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;

  name: string;
  croppedWidth: number;
  croppedHeight: number;

  fileName = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private dataService: DataService,
              private navigationService: NavigationService) {
    this.name = 'Angular2';
  }

  times: string[] = [];
  map: google.maps.Map;
  markers: google.maps.Marker[] = [];
  venue: Venue;
  event = {
    times: [],
    title: '',
    venue: undefined,
    image: File,
    imageUrl: '',
    userId: -1
  };
  submitting = false;

  ngOnInit() {
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 12; m++) {
        this.times.push(( h < 10 ? '0' + h : h) + ':' + ( m < 2 ? '0' + (m * 5) : (m * 5) ) );
      }
    }

    this.event.times.push(new DateTime());
  }

  ngAfterViewInit(): void {
    const mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    const map = this.map;
    const searchInput = this.searchInput.nativeElement;

    const searchBox = new google.maps.places.SearchBox(searchInput);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    // Init markers
    const scope = this;

    const handleMap = function() {
      const places = searchBox.getPlaces();

      if (places.length == 0) { return; }

      // Clear out the old markers.
      scope.markers.forEach(function(marker) {marker.setMap(null); });
      scope.markers = [];

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }
        const icon = {
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

    };
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', handleMap);
  }

  fileChangeListener($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
      this.imageChangedEvent = loadEvent;
    };

    myReader.readAsDataURL(file);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.event.imageUrl = event.base64;
  }
  loadImageFailed() {
    // show message
    console.log('failed');
  }

  addDateTime(event) {
    this.event.times.push(new DateTime());
    console.log(this.markers);
    event.preventDefault();
  }

  onDateSelected(index, event) {
    this.event.times[index].setDate(event);
  }

  removeDateTime($event, index) {
    this.event.times.splice(index, 1);
    event.preventDefault();
  }

  private validateForm() {
    return true;
  }

  onSubmit() {
    if (this.validateForm()) {
      if (!this.event.venue) {
        this.event.venue = new Venue(
          -1,
          '',
          this.markers[0].getPosition().lat(),
          this.markers[0].getPosition().lng(),
          this.searchInput.nativeElement.value,
          this.address2.nativeElement.value,
          this.map['mapUrl']
        );
      }

      this.submitting = true;
      this.dataService.postTinyEvent(this.event).subscribe(
        (value: any) => {
        // console.log(value);
          this.submitting = false;
          this.navigationService.navigate('/');
          alert('slsl');
        },
      (error: any) => {
        console.log(error);
        this.submitting = false;
      });
    }
  }


  fileChanged($event) {
    const file = $event.target.files[0];
    if (file) {
      this.imageCropperModal.show();
      this.imageChangedEvent = $event;
      this.fileName = file.name;
      this.event.image = file;
    }
  }

  removeImage() {
    this.fileName = '';
    this.cropper.resetCropperPosition();
    this.fileInput.nativeElement.value = '';
  }

  onImageClick() {
      this.fileInput.nativeElement.click();
  }
}
