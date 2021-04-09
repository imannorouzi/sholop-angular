import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, Input} from '@angular/core';
import {DateTime} from "../date-time";
import {Venue} from "../venue";
import { DataService } from "../utils/data.service";
import {ModalComponent} from "../common-components/ng-modal/modal.component";
import {NavigationService} from "../utils/navigation.service";
import {AddAttendeeComponent} from "../add-attendee/add-attendee.component";
import {AlertService} from "../alert.service";
import {MapsAPILoader} from "@agm/core";
import {DateService} from "../utils/date.service";
import {ContactsModalComponent} from "../contacts-modal/contacts-modal.component";
import {AuthService} from "../utils/auth.service";
import {ImageCropperComponent} from "ngx-image-cropper";

@Component({
  selector: 'create-meeting',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.css']
})
export class CreateTokenComponent implements OnInit {

  @ViewChild('searchBox') searchInput: ElementRef;
  @ViewChild('address2') address2: ElementRef;
  @ViewChild('cropper', {static: true}) cropper:ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal:ModalComponent;
  @ViewChild('contactsModal') contactsModal: ContactsModalComponent;
  @ViewChild('venuesModal') venuesModal:ModalComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('addAttendee') addAttendee: AddAttendeeComponent;

  name: string;
  date: Date;

  constructor(private dataService : DataService,
              private navigationService: NavigationService,
              private authService: AuthService,
              private alertService: AlertService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone,
              public dateService: DateService){
  }

  public zoom: number;

  times : string[] = [];
  event = {
    userId: -1,
    attendees: [],
    venue: new Venue(),
    chairId: -1,
    chair: undefined,
    eventType: "TOKEN",
    oneTime: true
  };

  user: any;

  submitting: boolean = false;

  ngOnInit() {
    this.user = this.authService.getCurrentUser();

    this.date = new Date();
    this.date.setHours(23);
    this.date.setMinutes(59);
    this.date.setSeconds(59);
  }

  private validateForm() {
    return true;
  }

  onSubmit(){
    if(this.validateForm()) {

      this.submitting = true;
      this.dataService.postMeeting(this.event).subscribe(
        (value:any) => {
          this.submitting = false;
          this.navigationService.navigate("/meetings");

          this.alertService.success("توکن با موفقیت ایجاد شد.");
        },
        (error:any) => {
          console.log(error);
          this.submitting = false;
        });
    }
  }


}
