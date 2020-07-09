import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../utils/common.service";
import {AuthService} from "../utils/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() theme: string;


  constructor(public authService: AuthService,
              private commonService: CommonService) {
  }

  ngOnInit() {
  }

  themeChanged(switchValue: any) {
    // 0 means light, 1 means dark

    this.commonService.themeChanged.next(switchValue === 0 ? 'light' : 'dark');
  }
}
