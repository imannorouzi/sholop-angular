import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {CommonService} from "../common.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() theme: string;
  currentUser : any = undefined;
  authenticationService: AuthenticationService;


  constructor(private as: AuthenticationService,
              private commonService: CommonService) {
    this.authenticationService = as;
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUser');
  }

  themeChanged(switchValue: any) {
    // 0 means light, 1 means dark

    this.commonService.themeChanged.next(switchValue === 0 ? 'light' : 'dark');
  }
}
