import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {CalendarComponent} from "../calendar/calendar.component";
import {MeetingItemModalComponent} from "../meeting-item-modal/meeting-item-modal.component";
import {DateService} from "../date.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('spinner') spinner: SpinnerComponent;
  @ViewChild('calendar') calendar: CalendarComponent;
  @ViewChild('meetingModal') meetingModal: MeetingItemModalComponent;

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
    this.spinner.show();

    this.dataService.getMeetings(date).subscribe(
      data => {
        data.object.forEach( event => {
          this.meetings.push(event);
        });
        this.spinner.hide();
        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.spinner.hide();
        this.loading = false;
      }
    )
  }

  onDateChanged(date: any) {
    this.readMeetings(date);

    this.selectedDate = date;
  }

  onMeetingClick(event: any){
    this.selectedMeeting = event;

    this.meetingModal.show();

  }

}
