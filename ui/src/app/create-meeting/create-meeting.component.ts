import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, NgZone, Input} from '@angular/core';
import { DataService } from '../utils/data.service';
import {ModalComponent} from '../common-components/ng-modal/modal.component';
import {NavigationService} from '../utils/navigation.service';
import {AlertService} from '../alert.service';
import {DateService} from '../utils/date.service';
import {AuthService} from '../utils/auth.service';
import {SuggestingItemInputComponent} from '../suggesting-item-input/suggesting-item-input.component';
import {ImageCropperComponent} from 'ngx-image-cropper';
import {CommonService} from "../utils/common.service";
import {GuestsComponent} from "../guests/guests.component";
import {SelectVenueComponent} from "../select-venue/select-venue.component";

@Component({
  selector: 'create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit, AfterViewInit {

  @ViewChild('searchBox') searchInput: ElementRef;
  @ViewChild('address2') address2: ElementRef;
  @ViewChild('cropper', {static: true}) cropper: ImageCropperComponent;
  @ViewChild('imageCropperModal', {static: true}) imageCropperModal: ModalComponent;
  @ViewChild('venuesModal') venuesModal: ModalComponent;
  @ViewChild('selectVenueComponent') selectVenueComponent: SelectVenueComponent;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  @ViewChild('selectChair') selectChair: SuggestingItemInputComponent;
  @ViewChild('guests') guests: GuestsComponent;

  name: string;
  step = 0;
  editingStep = -1;

  constructor(private dataService: DataService,
              private navigationService: NavigationService,
              private authService: AuthService,
              private alertService: AlertService,
              public commonService: CommonService,
              public dateService: DateService) {
  }

  times: string[] = [];
  event = {
    userId: -1,
    dates: [],
    dateStrings: [],
    attendees: [],
    title: '',
    venue: undefined,
    chairId: -1,
    chair: this.authService.getCurrentUser(),
    welcomeMessage: '',
    eventType: 'MEETING',
    imChair: true
  };

  chairs: any[];
  chairHint: string = this.authService.name;
  user: any;

  submitting = false;

  ngOnInit() {

    this.user = this.authService.getCurrentUser();

    const d = new Date(); d.setHours(0, 0, 0, 0);
    this.event.dates.push({date: d, startTime: new Date(), endTime: new Date()});
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 12; m++) {
        this.times.push(( h < 10 ? '0' + h : h) + ':' + ( m < 2 ? '0' + (m * 5) : (m * 5) ) );
      }
    }
  }

  addDateTime(event) {
    const d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);

    this.event.dates.push({date: d, startTime: new Date(), endTime: new Date()});
    event.preventDefault();
  }

  onDateSelected(index, event) {
    this.event.dates[index].date = event;
  }

  removeDateTime($event, index) {
    this.event.dates.splice(index, 1);
    event.preventDefault();
  }

  private validateForm() {
    return true;
  }

  onSubmit() {
    if (this.validateForm()) {
      this.event.venue = this.selectVenueComponent.getVenue();
      this.event.attendees = this.guests.getAttendees();
      // take times to utc format
      if (this.event.dates) {
        this.event.dateStrings = this.event.dates.map(d => {
          return {
            date: d.date.gDate.toISOString(),
            startTime: d.startTime.toISOString(),
            endTime: d.endTime.toISOString(),
            dateString: this.dateService.getPersianDateString(d.date.gDate, d.startTime, d.endTime)
          };
        });
      }

      this.submitting = true;
      this.dataService.postMeeting(this.event).subscribe(
        (res: any) => {
          if (res && res.msg === 'OK') {
            this.navigationService.navigate('/meetings');
            this.alertService.success('ملاقات با موفقیت ایجاد شد.');
          } else {
            this.alertService.error('ببخشید، مشکلی پیش آمد. دوباره تلاش کنید.');
          }
          this.submitting = false;

        },
        (error: any) => {
          console.log(error);
          this.submitting = false;
        });
    }
  }

  fromTimeChanged(dateObj, i) {
    this.event.dates[i].startTime = dateObj;
  }

  toTimeChanged(event, i) {
    this.event.dates[i].endTime = event;
  }

  chairSelected(chair: any) {
    if (chair) {
      this.event.chair = chair;
      this.event.userId = chair.id;
      this.chairHint = chair.name;
    }
  }

  ngAfterViewInit(): void {

  }

  onChairInputKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {

      case 13: // Enter
      case 38: // Arrow Up
      case 40: // Arrow Down
        break;

      default:
        this.clearChair();
        this.dataService.getContacts(this.chairHint)
          .subscribe(
            data => {
              if (data.msg === 'OK') {
                this.chairs = data.object;
              }
            },
            error1 => {
              console.log(error1);
            }
          );
    }

    this.selectChair.onKeyUp(event);
    event.preventDefault();
  }

  clearChairInput() {
    this.clearChair();
    this.chairHint = '';
  }

  clearChair() {
    this.event.chair = undefined;
  }
}
