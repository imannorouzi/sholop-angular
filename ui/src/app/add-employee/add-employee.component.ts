import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../common-components/ng-modal/modal.component";
import {DataService} from "../utils/data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {AlertService} from "../alert.service";
import {AuthService} from "../utils/auth.service";
import {ImageCropperComponent} from "ngx-image-cropper";

@Component({
  selector: 'add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  @ViewChild('childModal', {static: true}) public modal: ModalComponent;
  @ViewChild('cropper', {static: true}) cropper: ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal:ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('emailField', {static: true}) emailField: any;
  @ViewChild('nameField', {static: true}) nameField: any;
  @ViewChild('phoneField', {static: true}) phoneField: any;

  @Output() onEmployeeAdded: EventEmitter<any> = new EventEmitter();

  @Input() index: number = -1;
  @Input() employee = {
    name: '',
    email: '',
    phone: '',
    imageUrl: '',
    image: File,
    id: -1,
    fileName: '',
    role: ''
  };

  submitted: boolean = false;


  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private dataService: DataService,
              private alertService: AlertService) {
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

    this.employee = contact;
    this.index = index;
  }

  reset(){
    this.employee = {
      name: '',
      email: '',
      phone: '',
      imageUrl: null,
      image: null,
      id: -1,
      fileName: '',
      role: 'user'
    };

  }

  fileChanged($event){
    let file = $event.target.files[0];
    if(file){
      this.imageCropperModal.show();
      this.employee.fileName = file.name;
    }

    $event.target.value = "";
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

  createEmployee(){

    this.submitted = true;
    if(!this.validateForm()) return;

      this.modal.hide();
      this.employee['username'] = this.employee.email;

      this.dataService.updateEmployee(this.employee).subscribe(
        (value:any) => {
          if(value.msg === "USER_EXISTS"){
            this.alertService.error("کاربری با این ایمیل ثبت شده است.");
          }else{
            this.onEmployeeAdded.emit(value.object);
          }
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
  }
}
