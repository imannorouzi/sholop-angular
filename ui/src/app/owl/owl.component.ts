import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-owl',
  templateUrl: './owl.component.html',
  styleUrls: ['./owl.component.css']
})
export class OwlComponent implements OnInit {

  @Input() type: string = 'double-blinking walking tree';
  @Input() size: string = 'sm';
  constructor() { }

  ngOnInit() {
  }

}
