import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {CalendarComponent} from "../calendar/calendar.component";
import {MeetingItemModalComponent} from "../meeting-item-modal/meeting-item-modal.component";
import {DateService} from "../date.service";
import {DummyData} from "../dummyData";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('calendar', {static: true}) calendar: CalendarComponent;
  @ViewChild('meetingModal', {static: true}) meetingModal: MeetingItemModalComponent;

  meetings = [];
  loading = false;

  selectedMeeting = undefined;

  selectedDate: any;

  constructor(private dataService : DataService,
              public dateService: DateService) { }

  ngOnInit() {

    let d = new Date();
    let date = new Date(d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );
    this.onDateChanged(date);
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
}
