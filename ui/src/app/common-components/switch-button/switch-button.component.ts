import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.css']
})
export class SwitchButtonComponent implements OnInit {

  @Input() defaultValue: number = 0; // 0 is left, 1 is right
  value: number = 0; // 0 is left, 1 is right
  @Input() leftIcon: string = '';
  @Input() rightIcon: string = '';
  @Input() leftText: string = '';
  @Input() rightText: string = '';


  @Output() switchChanged: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.value = this.defaultValue;
  }

  switchClicked($event: MouseEvent) {
    this.value = Math.abs(this.value -1);

    this.switchChanged.emit(this.value);
  }

  setValue(value){
    this.value = value;
  }
}
