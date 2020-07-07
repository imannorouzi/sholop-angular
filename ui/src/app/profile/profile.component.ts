import {Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../ng-modal/modal.component";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {DataService} from "../utils/data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {AlertService} from "../alert.service";
import {User} from "../user";
import {MapsAPILoader} from "@agm/core";
import {AuthService} from "../utils/auth.service";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('cropper', {static: true}) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal:ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('searchBox', {static: true}) searchInput: ElementRef;


  @Output() onContactAdded: EventEmitter<any> = new EventEmitter();

  user: User;
  submitted: boolean = false;

  data1:any;
  cropperSettings1:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;

  public zoom: number;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private authService: AuthService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,) {

    this.user = authService.getCurrentUser();

    this.cropperSettings1 = new CropperSettings();
    this.cropperSettings1.width = 200;
    this.cropperSettings1.height = 200;

    this.cropperSettings1.croppedWidth = 200;
    this.cropperSettings1.croppedHeight = 200;

    this.cropperSettings1.canvasWidth = 200;
    this.cropperSettings1.canvasHeight = 200;

    this.cropperSettings1.minWidth = 10;
    this.cropperSettings1.minHeight = 10;

    this.cropperSettings1.rounded = false;
    this.cropperSettings1.keepAspect = true;

    this.cropperSettings1.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings1.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings1.noFileInput = true;

    this.data1 = {};
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    this.zoom = 12;

    //set current position
    if(this.user.latitude === 0 ){
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
          this.user.latitude = place.geometry.location.lat();
          this.user.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }


  fileChanged($event){
    let file = $event.target.files[0];
    if(file){
      this.imageCropperModal.show();
      this.cropper.fileChangeListener($event);
      this.user.fileName = file.name;
    }
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

  updateUser(){

    this.submitted = true;
    if(!this.validateForm()) return;

    this.user.farsiAddress1 = this.searchInput.nativeElement.value;

    this.dataService.updateUser(this.user).subscribe(
      (data:any) => {
        if (data && data.msg === "OK") {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          data.object.token = this.authService.getCurrentUser().token;
          localStorage.setItem('currentUser', JSON.stringify(data.object));
          this.alertService.success("تغییرات ذخیره شد.");
        }else{
          this.alertService.error("لطفا دوباره تلاش کنید.")
        }
      },
      (error:any) => {
        console.log(error);
        this.alertService.error(error.toString())
      });
  }

  onImageCropperModalOk() {
    this.imageCropperModal.hide();
    this.user.image = this.data1.image;
    this.user.imageUrl = this.data1.image;
  }

  markerMoved(e) {

    this.user.latitude = e.coords.lat;
    this.user.longitude = e.coords.lng;

  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.user.latitude = position.coords.latitude;
        this.user.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
}
