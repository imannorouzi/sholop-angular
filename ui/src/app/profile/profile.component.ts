import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../ng-modal/modal.component";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {DataService} from "../data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {AlertService} from "../alert.service";
import {AuthenticationService} from "../authentication.service";
import {ModalDirective} from "ngx-bootstrap";
import {User} from "../user";

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', undefined) imageCropperModal:ModalComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('spinner') spinner: SpinnerComponent;


  @Output() onContactAdded: EventEmitter<any> = new EventEmitter();

  user: User;
  submitting: boolean = false;

  data1:any;
  cropperSettings1:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private authenticationService: AuthenticationService) {

    this.user = authenticationService.getUser();

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
  }

  fileChanged($event){
    let file = $event.target.files[0];
    if(file){
      this.imageCropperModal.show();
      this.cropper.fileChangeListener($event);
      // this.user.fileName = file.name;
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

  onImageCropperModalOk() {
    this.imageCropperModal.hide();
    // this.user.image = this.data1.image
  }
}
