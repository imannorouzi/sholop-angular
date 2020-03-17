import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DateService} from "../date.service";


@Component({
  selector: 'date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent implements OnInit {
  @ViewChild('input', {static: true}) input: ElementRef;

  @Input() selectedDate;

  @Input() inputClasses: string = '';
  @Output() onDateSelected: EventEmitter<any> = new EventEmitter();

  isShowing: boolean = false;

  constructor(public dateService: DateService) { }

  ngOnInit() {
    // this.selectedDate = new Date();
  }

  onDaySelected(day) {
    this.isShowing = false;
    this.selectedDate = day;
    this.onDateSelected.emit(day);
  }

  onFocus(){
    this.isShowing = true;
  }

  hide(){
    this.isShowing = false;
  }

  getValue(){
    return this.input.nativeElement.value;
  }
}
