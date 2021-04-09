import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from '../common-components/ng-modal/modal.component';
import {DataService} from '../utils/data.service';
import {SpinnerComponent} from '../spinner/spinner.component';
import {AlertService} from '../alert.service';
import {AuthService} from '../utils/auth.service';
import {ImageCroppedEvent, ImageCropperComponent} from 'ngx-image-cropper';
import {CommonService} from "../utils/common.service";

@Component({
  selector: 'add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  @ViewChild('childModal', {static: true}) public modal: ModalComponent;
  @ViewChild('cropper', {static: true}) cropper: ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal: ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('emailField', {static: true}) emailField: any;
  @ViewChild('nameField', {static: true}) nameField: any;
  @ViewChild('phoneField', {static: true}) phoneField: any;

  @Output() onContactAdded: EventEmitter<any> = new EventEmitter();

  @Input() index = -1;
  @Input() contact = {
    name: '',
    email: '',
    phone: '',
    imageUrl: '',
    image: '',
    id: -1,
    fileName: '',
  };

  submitted = false;


  imageChangedEvent: any = '';

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private authService: AuthService,
              private commonService: CommonService) {
  }

  ngOnInit() {
  }

  show() {
    this.modal.show();
  }

  hide() {
    this.modal.hide();
  }

  setContact(contact, index) {

    contact = Object.assign({}, contact);

    this.contact = contact;
    this.index = index;
  }

  reset() {
    this.contact = {
      name: '',
      email: '',
      phone: '',
      imageUrl: null,
      image: null,
      id: -1,
      fileName: '',
    };

  }

  fileChanged($event) {
    const file = $event.target.files[0];
    if (file) {
      this.imageCropperModal.show();
      this.imageChangedEvent = $event;
      this.contact.fileName = file.name;
    }

    // $event.target.value = '';
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

  createContact() {

    this.submitted = true;
    if (!this.validateForm()) { return; }

      this.modal.hide();
      this.contact['userId'] = this.authService.userId;

      this.dataService.updateContact(this.contact).subscribe(
        (value: any) => {
          if (value.msg === 'OK') {
            if(value.object.imageUrl && this.commonService.getBase()){
              value.object.imageUrl = this.commonService.getBase() + value.object.imageUrl;
            }
            this.onContactAdded.emit(value.object);
          } else if (value.msg === 'CONTACT_EXISTS') {
            this.alertService.warn('مخاطبی با این ایمیل قبلا ثبت شده است.');
          } else if (value.msg === 'USER_EXISTS') {
            this.alertService.warn('همکاری با این ایمیل ثبت شده است.');
          }
        },
        (error: any) => {
          console.log(error);
          // this.spinner.hide();
          this.modal.show();
          this.alertService.error(error.toString());
        });
  }

  onImageCropperModalOk() {
    this.imageCropperModal.hide();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.contact.image = event.base64;
    this.contact.imageUrl = event.base64;
  }
  loadImageFailed() {
    // show message
    console.log('failed');
  }
}
