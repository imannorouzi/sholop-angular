import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  @ViewChild("minutesColumn") minutesColumn: ElementRef;
  @ViewChild("hoursColumn") hoursColumn: ElementRef;
  @ViewChild("input") input: ElementRef;

  isHourShowing: boolean = false;
  isMinuteShowing: boolean = false;
  @Input() inputClasses: string = '';
  @Input() placeholder: string = '-- : --';


  @Output() onTimeSelected: EventEmitter<any> = new EventEmitter();

  hours: string[] = [];
  minutes: string[] = [];

  hourString: string = "";
  minuteString: string = "";

  constructor() { }

  ngOnInit() {

    for(let h=0; h<24; h++) {
      this.hours.push( h<10 ? '0'+h : h.toString());
    }


    for(let m=0; m<12; m++){
      this.minutes.push( m<2 ? '0' + (m*5).toString() : (m*5).toString() );
    }

  }

  onFocus(){
    this.isHourShowing = true;
    this.isMinuteShowing = false;
  }

  onCellHourClick($event, index) {
    this.hourString = this.hours[index];
    this.isHourShowing = false;
    this.isMinuteShowing = true;
  }

  onCellMinuteClick($event, index) {
    this.isMinuteShowing = false;
    this.minuteString = this.minutes[index];

    this.onTimeSelected.emit(this.hourString+':' + this.minuteString);
  }

  onTimeChanged(){
    this.onTimeSelected.emit(this.input.nativeElement.value);
  }
}
