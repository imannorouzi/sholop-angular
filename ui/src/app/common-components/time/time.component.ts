import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {
  @ViewChild("minutesColumn", {static: true}) minutesColumn: ElementRef;
  @ViewChild("hoursColumn", {static: true}) hoursColumn: ElementRef;
  @ViewChild("input", {static: true}) input: ElementRef;

  isShowing: boolean = false;
  @Input() inputClasses: string = '';
  @Input() placeholder: string = '-- : --';


  @Output() onTimeSelected: EventEmitter<any> = new EventEmitter();

  hourString: number = 0;
  minuteString: number = 0;

  mainRow: number = 5;

  hours: any[] = [];
  minutes: any[] = [];
  dummyRows: any[] = [];

  @Input() date: Date;

  constructor() { }

  ngOnInit() {


    if(this.date){
      this.hourString =  this.date.getHours();
      this.minuteString = this.date.getMinutes();
    }

    this.dummyRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
    this.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  }

  onFocus(){
    this.isShowing = true;
  }

  /*hourChange(increment: boolean = false){
    if(increment)this.listUp(this.hours);
    else this.listDown(this.hours);
  }

  minuteChange(increment: boolean = false){
    if(increment)this.listUp(this.minutes);
    else this.listDown(this.minutes);
  }

  listUp(list){
    let e = list.pop();
    list.unshift(e);

    this.hourString = (this.hours[this.mainRow]<10 ? '0' : '') +this.hours[this.mainRow];
    this.minuteString = (this.minutes[this.mainRow]<10 ? '0' : '') + this.minutes[this.mainRow];

    this.onTimeChanged();
  }

  listDown(list){
    let e = list.shift();
    list.push(e);

    this.hourString = (this.hours[this.mainRow]<10 ? '0' : '') +this.hours[this.mainRow];
    this.minuteString = (this.minutes[this.mainRow]<10 ? '0' : '') +this.minutes[this.mainRow];

    this.onTimeChanged();
  }

  onHourScroll($event) {
    $event.preventDefault();
    if($event.wheelDeltaY>0){
      this.listUp(this.hours);
    }else{
      this.listDown(this.hours);
    }
  }

  onMinuteScroll($event) {
    $event.preventDefault();
    if($event.wheelDeltaY>0){
      this.listUp(this.minutes);
    }else{
      this.listDown(this.minutes)
    }
  }

  hourClick(i) {
    if(i<this.mainRow){
      this.listUp(this.hours);
      setTimeout( () =>{this.hourClick(i+1)}, 50);
    }else if(i>this.mainRow){
      this.listDown(this.hours);
      setTimeout( () =>{this.hourClick(i-1)}, 50);
    }
  }

  minuteClick(i) {
    if(i<this.mainRow){
      this.listUp(this.minutes);
      setTimeout( () =>{this.minuteClick(i+1)}, 50);
    }else if(i>this.mainRow){
      this.listDown(this.minutes);
      setTimeout( () =>{this.minuteClick(i-1)}, 50);
    }
  }*/

  onTimeChanged(){
      let date = new Date();
      date.setHours(Number(this.hourString));
      date.setMinutes(Number(this.minuteString));
      this.onTimeSelected.emit(date);
  }

  onHourChange(step){
    if (step > 0) {
      this.hourString = (this.hourString + 1) % 24;
    }else{
      if(this.hourString === 0){
        this.hourString = 23;
      }else{
        this.hourString = (this.hourString - 1) % 24;
      }
    }

    this.onTimeChanged();
  }

  onMinuteChange(step){
    if (step > 0) {
      this.minuteString = (this.minuteString + 1) % 59;
    }else{
      if(this.minuteString === 0){
        this.minuteString = 59;
      }else{
        this.minuteString = (this.minuteString - 1) % 59;
      }
    }

    this.onTimeChanged();
  }

  clickOutside(value: boolean = false) {
    this.isShowing = value;
  }
}
