import {Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from '../common-components/ng-modal/modal.component';
import {DataService} from '../utils/data.service';
import {SpinnerComponent} from '../spinner/spinner.component';
import {AlertService} from '../alert.service';
import {User} from '../user';
import {MapsAPILoader} from '@agm/core';
import {AuthService} from '../utils/auth.service';
import {TEHRAN} from '../venue';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('cropper', {static: true}) cropper: ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal: ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('searchBox', {static: true}) searchInput: ElementRef;


  @Output() onContactAdded: EventEmitter<any> = new EventEmitter();

  user: User;
  submitted = false;


  imageChangedEvent: any = '';

  mapLat: number = TEHRAN.lat;
  mapLng: number = TEHRAN.lng;

  public zoom: number;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private authService: AuthService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone, ) {
  }

  ngOnInit() {
    this.user = Object.assign({}, this.authService.getCurrentUser());

    this.zoom = 12;

    // set current position
    if (this.user.latitude === 0 ) {
      this.setCurrentPosition();
    }

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
          this.user.latitude = place.geometry.location.lat();
          this.user.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.mapLat = place.geometry.location.lat();
          this.mapLng = place.geometry.location.lng();
        });
      });
    });
  }


  fileChanged($event) {
    const file = $event.target.files[0];
    if (file) {
      this.imageCropperModal.show();
      this.imageChangedEvent = $event;
      this.user.fileName = file.name;
    }

    // $event.target.value = '';
  }

  imageCropped(event: ImageCroppedEvent) {
    this.user.imageUrl = event.base64;
    this.user.image = event.base64;
  }
  loadImageFailed() {
    // show message
    console.log('failed');
  }

  onImageClick() {
    /*if(this.data1.image)
      this.imageCropperModal.show();
    else*/
    this.fileInput.nativeElement.click();
  }

  private validateForm() {
    return true;
  }

  updateUser() {

    this.submitted = true;
    if (!this.validateForm()) { return; }

    this.user.farsiAddress1 = this.searchInput.nativeElement.value;

    this.dataService.updateUser(this.user).subscribe(
      (data: any) => {
        if (data && data.msg === 'OK') {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          data.object.token = this.authService.getCurrentUser().token;
          this.authService.login(data.object);

          this.alertService.success('تغییرات ذخیره شد.');
        } else {
          this.alertService.error('لطفا دوباره تلاش کنید.');
        }
      },
      (error: any) => {
        console.log(error);
        this.alertService.error(error.toString());
      });
  }

  onImageCropperModalOk() {
    this.imageCropperModal.hide();
  }

  markerMoved(e) {

    this.user.latitude = e.coords.lat;
    this.user.longitude = e.coords.lng;

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': e.coords}, (res, status) => {
      if (status === google.maps.GeocoderStatus.OK && res.length) {
        this.ngZone.run(() => this.user.farsiAddress1 = res[0].formatted_address);
      }
    });
  }

  mapClicked(e) {

    this.user.latitude = e.coords.lat;
    this.user.longitude = e.coords.lng;

    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': e.coords}, (res, status) => {
      if (status === google.maps.GeocoderStatus.OK && res.length) {
        this.ngZone.run(() => this.user.farsiAddress1 = res[0].formatted_address);
      }
    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.user.latitude = position.coords.latitude;
        this.user.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
}
