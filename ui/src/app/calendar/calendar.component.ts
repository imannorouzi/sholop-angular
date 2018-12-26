import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateService} from "../date.service";

const daysInMonth: number[] = [
  31,31,31,31,31,31,30,30,30,30,30,29
];

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  today;
  selectedDate;

  monthOffset = 0;

  month = {
    monthOffset: undefined,
    today: undefined,
    currentMonth: undefined,
    currentYear: undefined,
    startDay: undefined,
    startGDay: undefined,
    monthDays: undefined,
    weeks: []
  };

  @Input() inputClasses: string = '';
  @Output() onDateSelected: EventEmitter<any> = new EventEmitter();

  constructor(public dateService: DateService) { }

  ngOnInit() {
    this.getMonthMapArray(0);
  }

  getMonthMapArray(monthOffset) {

    this.monthOffset = monthOffset;
    this.month.monthOffset = monthOffset%12;

    let date = new Date();
    this.today = this.dateService.getSholopDate(date);

    let counter = 0;
    let daysToMove = 0;
    if(monthOffset < 0){
      while(counter != monthOffset){
        daysToMove -= daysInMonth[(this.today.jDate.month + counter)%12];
        counter--;
      }
    }else{
      while(counter != monthOffset){
        daysToMove += daysInMonth[(this.today.jDate.month + counter)%12];
        counter++;
      }
    }

    date.setDate(date.getDate() + daysToMove);
    this.today = this.dateService.getSholopDate(date);
    // date.setMonth(date.getMonth()+monthOffset)

    this.selectedDate = this.today;

    this.month.currentMonth = parseInt(this.today.jDate.month);
    this.month.currentYear = this.today.jDate.year;
    this.month.monthDays = daysInMonth[this.today.jDate.month];

    let month = [];

    let week = [];

    let firstDayInCalendar = this.dateService.getSholopDate(
      new Date(this.today.gDate.getFullYear(),
        this.today.gDate.getMonth(),
        this.today.gDate.getDate() - this.today.jDate.date
      )
    );

    for(let i=0; i<(firstDayInCalendar.gDate.getDay()+2)%7; i++){
      week.push(undefined);
    }

    for(let d=1; d<= daysInMonth[this.month.currentMonth]; d++){
      if( week.length == 7 ){
        month.push((week));
        week = [];
      }

      week.push(
        this.dateService.getSholopDate(
          new Date(this.today.gDate.getFullYear(),
            this.today.gDate.getMonth(),
            this.today.gDate.getDate() - this.today.jDate.date + d
          )
        )
      );
    }
    if( week.length > 0) month.push(week);

    this.month.weeks = month;
  }

  onDaySelected(day) {
    this.selectedDate = day;
    this.onDateSelected.emit(day);
  }
}
