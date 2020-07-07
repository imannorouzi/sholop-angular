import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'time',
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

  hourString: string = "";
  minuteString: string = "";

  mainRow: number = 5;

  hours: any[] = [];
  minutes: any[] = [];
  dummyRows: any[] = [];

  @Input() date: Date;

  constructor() { }

  ngOnInit() {


    if(this.date){
      this.hourString = (this.date.getHours()<10 ? '0' : '') + this.date.getHours().toString();
      this.minuteString = (this.date.getMinutes()<10 ? '0' : '') + this.date.getMinutes().toString();
    }

    this.dummyRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    this.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
    this.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  }

  onFocus(){
    this.isShowing = true;
  }

  hourChange(increment: boolean = false){
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
  }

  onTimeChanged(){

    let stringValue = this.input.nativeElement.value;
    let date = new Date();

    date.setHours(Number(this.hourString));
    date.setMinutes(Number(this.minuteString));

    this.onTimeSelected.emit(date);
  }

  clickOutside(value: boolean = false) {
    this.isShowing = value;
  }
}
