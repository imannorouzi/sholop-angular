import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DateService} from "../../utils/date.service";

@Component({
  selector: 'date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  @ViewChild('input', {static: true}) input: ElementRef;

  @Input() inputClasses: string = '';
  @Output() onDateSelected: EventEmitter<any> = new EventEmitter();

  isShowing: boolean = false;

  constructor(public dateService: DateService) { }

  ngOnInit() {
    // this.selectedDate = new Date();
  }

  onDaySelected(sholopDate) {
    this.onDateSelected.emit(sholopDate);
    this.isShowing = false;
  }

  onFocus(){
    this.isShowing = true;
  }

  hide(){
    this.isShowing = false;
  }

  clickOutside(inside: boolean = false) {
    if(!inside) this.isShowing = inside;
  }
}
