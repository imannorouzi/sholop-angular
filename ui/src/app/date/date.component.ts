import {Component, Input, OnInit} from '@angular/core';
import {Calendar} from "../calendar";

const daysInMonth: number[] = [
  31,31,31,31,31,31,30,30,30,30,30,29
]

@Component({
  selector: 'date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {

  today;
  selectedDate;

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
  isShowing: boolean = false;

  constructor() { }

  ngOnInit() {
    this.getMonthMapArray(0);
  }

  getMonthMapArray(monthOffset) {

    let daysBack = 0;
    while(monthOffset !== 0){
      monthOffset += (monthOffset>0) ? -1 : 1;
    }

    this.month.monthOffset = monthOffset%12;
    this.today = new Calendar(new Date());
    this.selectedDate = this.today;

    this.month.currentMonth = this.today.month+monthOffset;
    this.month.currentYear = this.today.year + Math.floor(monthOffset/12);
    this.month.monthDays = daysInMonth[this.today.month];

    let month = [];

    var week = [];
    for(var i=0; i<(this.today.today.getDay()+5)%7; i++){
      week.push(undefined);
    }

    for(var d=1; d<=this.month.monthDays; d++){
      if( week.length == 7 ){
        month.push((week));
        week = [];
      }

      week.push(
        new Calendar(
          new Date(this.today.today.getFullYear(),
            this.today.today.getMonth(),
            this.today.today.getDate() - this.today.day + d
          )
        )
      );
    }
    if( week.length > 0) month.push(week);

    this.month.weeks = month;
  }


  onDaySelected(day) {
    this.isShowing = false;
    this.selectedDate = day;
  }

  onFocus(){
    this.isShowing = true;
  }
}
