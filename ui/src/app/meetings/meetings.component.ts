import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../utils/data.service';
import {SpinnerComponent} from '../spinner/spinner.component';
import {MeetingItemModalComponent} from '../meeting-item-modal/meeting-item-modal.component';
import {DateService} from '../utils/date.service';
import {AlertService} from '../alert.service';
import {MeetingService, readMethod} from './meeting.service';
import {CommonService} from '../utils/common.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit, OnDestroy, AfterViewInit {


  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('meetingModal', {static: true}) meetingModal: MeetingItemModalComponent;

  meetings = {};
  loading = true;

  selectedMeeting = undefined;

  earliestDate: Date;
  latestDate: Date;

  noMoreForward = false;
  noMoreBackward = false;

  filter = '';
  interval;

  subscriptions: Subscription[] = [];

  constructor(private dataService: DataService,
              public dateService: DateService,
              private alertService: AlertService,
              public meetingService: MeetingService,
              public commonService: CommonService,
              private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewChecked()  {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.subscriptions.push(
      this.meetingService.readMeetings
      .subscribe( (method) => {
        this.readMeetings(method);
      })
    );
  }

  ngAfterViewInit(): void {
    this.meetingService.readMeetings.next(readMethod.INITIAL);
  }

  readMeetings(method) {
    let params = {};
    switch (method) {
      case readMethod.INITIAL:
        this.meetings = {};
        this.meetings[this.meetingService.getDate().toISOString()] = [];
        this.earliestDate = new Date(this.meetingService.getDate());
        this.latestDate = new Date(this.meetingService.getDate());
        this.noMoreForward = false;
        this.noMoreBackward = false;
        params = {date: this.meetingService.getDate().toISOString(), period: this.meetingService.period.toString()};
        break;
      case readMethod.MORE_BACKWARD:
        // this.earliestDate.setDate(this.earliestDate.getDate() - 1);
        params = {date: this.earliestDate.toISOString(), limit: -1};
        break;
      case readMethod.MORE_FORWARD:
        this.latestDate.setDate(this.latestDate.getDate() + 1);
        params = {date: this.latestDate.toISOString(), limit: 1};
        break;
      default: break;
    }

    this.dataService.getMeetings(params).subscribe(
      data => {
        if (data.msg === 'OK') {

          if (data.object) {
            data.object.forEach(event => {
              event.dates.forEach(ed => {
                const date = new Date(ed.date);
                if (!this.meetings[date.toISOString()]) {
                  this.meetings[date.toISOString()] = [event];
                } else {
                  this.meetings[date.toISOString()].push(event);
                }

                if (!this.earliestDate || this.earliestDate > date) { this.earliestDate = new Date(date); }
                if (!this.latestDate || this.latestDate < date) { this.latestDate = new Date(date); }
              });
            });

            if (data.object.length === 0) {
              if (method === readMethod.MORE_FORWARD) { this.noMoreForward = true; }
              if (method === readMethod.MORE_BACKWARD) { this.noMoreBackward = true; }
            }
          }
        } else {
          this.alertService.error('مشکلی پیش آمده!');
        }
        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    );
  }

  onMeetingClick(event: any) {
    this.selectedMeeting = event;
    this.meetingModal.show();
  }


  ngOnDestroy(): void {
    clearInterval(this.interval);

    this.subscriptions.forEach( sub => {
      sub.unsubscribe();
    });

    this.subscriptions = [];
  }

  loadMoreForward() {
    this.meetingService.readMeetings.next(readMethod.MORE_FORWARD);
  }

  loadMoreBackward() {
    this.meetingService.readMeetings.next(readMethod.MORE_BACKWARD);
  }
}
