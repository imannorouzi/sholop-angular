import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-sliding-text',
  templateUrl: './sliding-text.component.html',
  styleUrls: ['./sliding-text.component.css']
})
export class SlidingTextComponent implements OnInit {

  @Input() scroll: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
