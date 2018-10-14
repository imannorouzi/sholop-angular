import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from "../ng-modal/modal.component";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {Venue} from "../venue";
import {DataService} from "../data.service";

@Component({
  selector: 'add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  @ViewChild('addNewContact') modal: ModalComponent;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', undefined) imageCropperModal:ModalComponent;
  @ViewChild('fileInput') fileInput: ElementRef;

  contact = {
    name: '',
    email: '',
    phone: '',
    image: File,
    id: -1
  };

  submitting: boolean = false;

  data1:any;
  cropperSettings1:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;

  constructor(private dataService: DataService) {
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

  show(){
    this.modal.show();
  }

  fileChanged($event){
    let file = $event.target.files[0];
    if(file){
      this.imageCropperModal.show();
      this.cropper.fileChangeListener($event);
      this.contact.image = file;
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

  onSubmit(){
    if(this.validateForm()) {

      this.submitting = true;
      this.dataService.updateContact(this.contact).subscribe(
        (value:any) => {
          // console.log(value);
          this.submitting = false;
          this.modal.hide();
          alert('slsl');
        },
        (error:any) => {
          console.log(error);
          this.submitting = false;
        });
    }
  }
}
