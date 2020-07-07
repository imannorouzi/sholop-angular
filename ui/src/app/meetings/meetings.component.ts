import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../utils/data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {CalendarComponent} from "../calendar/calendar.component";
import {MeetingItemModalComponent} from "../meeting-item-modal/meeting-item-modal.component";
import {DateService} from "../utils/date.service";
import {DummyData} from "../dummyData";
import {ReceptionService} from "../reception/reception.service";

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent implements OnInit, OnDestroy {
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('calendar', {static: true}) calendar: CalendarComponent;
  @ViewChild('meetingModal', {static: true}) meetingModal: MeetingItemModalComponent;

  meetings = [];
  loading = false;

  selectedMeeting = undefined;

  selectedDate: any;
  interval;

  constructor(private dataService : DataService,
              public dateService: DateService,
              private receptionService: ReceptionService) { }

  ngOnInit() {

    let d = new Date();
    let date = new Date(d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );
    this.onDateChanged(date);

    /*this.interval = setInterval(() => {
      let meeting = this.meetings[Math.floor(Math.random() * this.meetings.length)];
      let contact = meeting.attendees[Math.floor(Math.random() * meeting.attendees.length)]

      this.receptionService.prompt({event: meeting, contact: contact});
    }, 30000);*/
  }

  readMeetings(date){
    this.meetings = [];
    this.loading = true;

    this.dataService.getMeetings(date).subscribe(
      data => {
        data.object.forEach( event => {
          this.meetings.push(event);
        });
        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    )
  }

  onDateChanged(date: any) {
    // this.readMeetings(date);

    this.meetings = [];
    this.readDummyMeetings(date);

    this.selectedDate = date;
  }

  onMeetingClick(event: any){
    this.selectedMeeting = event;

    this.meetingModal.show();

  }

  private readDummyMeetings(date: any) {
    this.loading = true;

    setTimeout( () => {
      this.loading = false;
      this.meetings = DummyData.MEETINGS;
    }, 1500);

  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
