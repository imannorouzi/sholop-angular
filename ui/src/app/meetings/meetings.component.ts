import {AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DataService} from "../utils/data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {CalendarComponent} from "../common-components/calendar/calendar.component";
import {MeetingItemModalComponent} from "../meeting-item-modal/meeting-item-modal.component";
import {DateService} from "../utils/date.service";
import {AlertService} from "../alert.service";
import {MeetingService} from "./meeting.service";
import {CommonService} from "../utils/common.service";

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit, OnDestroy, AfterViewInit {


  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('calendar', {static: true}) calendar: CalendarComponent;
  @ViewChild('meetingModal', {static: true}) meetingModal: MeetingItemModalComponent;

  meetings = {};
  loading = false;

  selectedMeeting = undefined;

  filter: string = '';
  selectedDate: any;
  interval;

  constructor(private dataService : DataService,
              public dateService: DateService,
              private alertService: AlertService,
              private meetingService: MeetingService,
              public commonService: CommonService) {
  }

  ngOnInit() {
    this.meetingService.readMeetings
      .subscribe( () => {
        this.readMeetings();
      })
  }

  ngAfterViewInit(): void {
    this.readMeetings();
  }

  readMeetings(){
    this.loading = true;

    this.dataService.getMeetings(
      this.meetingService.getDate(),
      this.meetingService.isShowingAll().toString()
    ).subscribe(
      data => {
        this.meetings = {};
        if(data.msg === "OK") {

          data.object.forEach(event => {
            event.dates.forEach( ed => {
              if(!this.meetings[ed.date]){
                this.meetings[ed.date] = [event];
              }else{
                this.meetings[ed.date].push(event);
              }
            })
          });
        }else{
          this.alertService.error('مشکلی پیش آمده!');
        }
        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    )
  }

  onMeetingClick(event: any){
    this.selectedMeeting = event;
    this.meetingModal.show();
  }


  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
