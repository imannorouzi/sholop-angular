import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.css']
})
export class AddressBookComponent implements OnInit {

  tab: number = 2;
  constructor() { }

  ngOnInit() {
  }

}
