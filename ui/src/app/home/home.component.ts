import { Component, OnInit } from '@angular/core';
import {DataService} from "../utils/data.service";
import {NavigationService} from "../utils/navigation.service";
import {environment} from "../../environments/environment";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../utils/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentPath: string = '';
  version: string = environment.VERSION;

  events = [];


  constructor(private dataService: DataService,
              public navigationService: NavigationService,
              private router: Router,
              public authService: AuthService) { }

  ngOnInit() {

    this.router.events.forEach((event) => {
      if(event instanceof NavigationEnd) {
        this.currentPath = this.router.url;
      }
    });
  }

}
