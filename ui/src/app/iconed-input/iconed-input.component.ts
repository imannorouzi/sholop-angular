import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'iconed-input',
  templateUrl: './iconed-input.component.html',
  styleUrls: ['./iconed-input.component.css']
})
export class IconedInputComponent implements OnInit {

  @Input() icon = '';
  @Input() placeholder = '';
  constructor() { }

  ngOnInit() {
  }

}
