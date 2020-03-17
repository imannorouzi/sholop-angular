import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalComponent} from "../ng-modal/modal.component";
import {CropperSettings, ImageCropperComponent} from "ng2-img-cropper";
import {Venue} from "../venue";
import {DataService} from "../data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {AlertService} from "../alert.service";
import {UserService} from "../user.service";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'add-attendee',
  templateUrl: './add-attendee.component.html',
  styleUrls: ['./add-attendee.component.css']
})
export class AddAttendeeComponent implements OnInit {
  @ViewChild('addAttendee', {static: true}) modal: ModalComponent;
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;

  addToContacts: boolean = true;

  @Output() onContactAdded: EventEmitter<any> = new EventEmitter();

  contact = {
    name: '',
    email: '',
    phone: '',
    image: File,
    id: -1,
    fileName: ''
  };

  submitting: boolean = false;

  constructor(private dataService: DataService,
              private alertService: AlertService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
  }

  show(){
    this.modal.show();
  }

  reset(){
    this.contact = {
      name: '',
      email: '',
      phone: '',
      image: null,
      id: -1,
      fileName: ''
    };
  }

  private validateForm() {
    return true;
  }

  onSubmit(){
    if(!this.validateForm()) return;

    this.modal.hide();

    if(this.addToContacts) {
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
    }else{
      this.onContactAdded.emit(this.contact);
    }
  }
}
