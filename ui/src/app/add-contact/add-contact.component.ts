import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../ng-modal/modal.component";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {DataService} from "../data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {AlertService} from "../alert.service";
import {AuthenticationService} from "../authentication.service";
import {ModalDirective} from "ngx-bootstrap";

@Component({
  selector: 'add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  @ViewChild('childModal') public modal:ModalDirective;
  @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', undefined) imageCropperModal:ModalComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('spinner') spinner: SpinnerComponent;
  @ViewChild('emailField') emailField: any;
  @ViewChild('nameField') nameField: any;
  @ViewChild('phoneField') phoneField: any;

  @Output() onContactAdded: EventEmitter<any> = new EventEmitter();

  @Input() index: number = -1;
  @Input() type: string = 'contact';
  @Input() contact = {
    name: '',
    email: '',
    phone: '',
    imageUrl: '',
    image: File,
    id: -1,
    fileName: '',
    type: this.type
  };

  submitted: boolean = false;

  data1:any;
  cropperSettings1:CropperSettings;
  croppedWidth:number;
  croppedHeight:number;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private authenticationService: AuthenticationService) {
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

  hide(){
    this.modal.hide();
  }

  setContact(contact, index){

    contact = Object.assign({}, contact);

    this.contact = contact;
    this.index = index;
  }

  reset(){
    this.contact = {
      name: '',
      email: '',
      phone: '',
      imageUrl: null,
      image: null,
      id: -1,
      fileName: '',
      type: this.type
    };

    this.cropper.reset();
  }

  fileChanged($event){
    let file = $event.target.files[0];
    if(file){
      this.imageCropperModal.show();
      this.cropper.fileChangeListener($event);
      this.contact.fileName = file.name;
    }
  }

  onImageClick() {
    /*if(this.data1.image)
      this.imageCropperModal.show();
    else*/
      this.fileInput.nativeElement.click();
  }

  private validateForm() {
    return this.nameField.valid && this.emailField.valid && this.phoneField.valid;
  }

  createContact(){

    this.submitted = true;
    if(!this.validateForm()) return;

      this.modal.hide();
      this.contact['userId'] = this.authenticationService.getUser().id;

      this.dataService.updateContact(this.contact).subscribe(
        (value:any) => {
          this.onContactAdded.emit(value.object);
        },
        (error:any) => {
          console.log(error);
          // this.spinner.hide();
          this.modal.show();
          this.alertService.error(error.toString())
        });
  }

  onImageCropperModalOk() {
    this.imageCropperModal.hide();
    this.contact.image = this.data1.image;
    this.contact.imageUrl = this.data1.image;
  }
}
