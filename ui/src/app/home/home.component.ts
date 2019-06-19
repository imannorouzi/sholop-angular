import { Component, OnInit } from '@angular/core';
import {DataService} from "../data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  events = [];

  quotes = [
    {text: "مدیر پروژه ی عزیز لطفا در مورد اینکه اینجا چی بنویسیم تصمیم بگیر"},
    {text: "مدیر پروژه ی عزیز لطفا در مورد اینکه اینجا چی بنویسیم تصمیم بگیر"},
    {text: "مدیر پروژه ی عزیز لطفا در مورد اینکه اینجا چی بنویسیم تصمیم بگیر"},
    {text: "مدیر پروژه ی عزیز لطفا در مورد اینکه اینجا چی بنویسیم تصمیم بگیر"},
    {text: "مدیر پروژه ی عزیز لطفا در مورد اینکه اینجا چی بنویسیم تصمیم بگیر"},
  ];

  constructor(private dataService: DataService) { }

  ngOnInit() {

    // this.readEvents();
  }


  readEvents(){

    this.dataService.getTinyEvents().subscribe(
      data => {
        data.object.forEach( event => {
            this.events.push(event);
        });
      },
      error1 => {
        console.log(error1);
      }
    )
  }

}
