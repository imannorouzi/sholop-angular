import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentUser : any = undefined;
  authenticationService: AuthenticationService;


  constructor(private as: AuthenticationService) {
    this.authenticationService = as;
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUser');
  }

}
