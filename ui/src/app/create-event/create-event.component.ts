import {Component, OnInit, ViewChild, AfterViewInit, ElementRef} from '@angular/core';
import {} from 'googlemaps';
import {DateTime} from "../date-time";
import {Venue} from "../venue";
import { DataService } from "../data.service";
import {Bounds, CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {ModalComponent} from "../ng-modal/modal.component";
import {NavigationService} from "../navigation.service";


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap', {static: true}) gmapElement: any;
  @ViewChild('searchBox', {static: true}) searchInput: ElementRef;
  @ViewChild('address2', {static: true}) address2: ElementRef;
  @ViewChild('cropper', {static: true}) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal:ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;

  name:string;
  data1:any;
  cropperSettings1:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;

  fileName : string = "";

  constructor(private dataService : DataService,
              private navigationService: NavigationService) {
    this.name = 'Angular2';
    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 440;
    this.cropperSettings1.height = 330;

    this.cropperSettings1.croppedWidth = 440;
    this.cropperSettings1.croppedHeight = 300;

    this.cropperSettings1.canvasWidth = 440;
    this.cropperSettings1.canvasHeight = 300;

    this.cropperSettings1.minWidth = 10;
    this.cropperSettings1.minHeight = 10;

    this.cropperSettings1.rounded = false;
    this.cropperSettings1.keepAspect = true;

    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings1.noFileInput = true;

    this.data1 = {};

  }

  times : string[] = [];
  map : google.maps.Map;
  markers : google.maps.Marker[] = [];
  venue : Venue;
  event = {
    times: [],
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

  cropped(bounds:Bounds) {
    this.croppedHeight =bounds.bottom-bounds.top;
    this.croppedWidth = bounds.right-bounds.left;
  }

  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);

    };

    myReader.readAsDataURL(file);
  }

  addDateTime(event) {
    this.event.times.push(new DateTime());
    console.log(this.markers);
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


  fileChanged($event) {
    let file = $event.target.files[0];
    if(file){
      this.imageCropperModal.show();
      this.cropper.fileChangeListener($event);
      this.fileName = file.name;
      this.event.image = file;
    }
  }

  removeImage() {
    this.fileName = "";
    this.cropper.reset();
    this.fileInput.nativeElement.value = '';
  }

  onImageClick() {
    if(this.data1.image)
      this.imageCropperModal.show();
    else
      this.fileInput.nativeElement.click();
  }
}
