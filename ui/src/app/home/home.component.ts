import { Component, OnInit } from '@angular/core';
import {DataService} from "../utils/data.service";
import {NavigationService} from "../utils/navigation.service";
import {environment} from "../../environments/environment";
import { Router} from "@angular/router";
import {AuthService} from "../utils/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  version: string = environment.VERSION;

  constructor(public navigationService: NavigationService,
              public authService: AuthService) { }

  ngOnInit() {

  }

}
