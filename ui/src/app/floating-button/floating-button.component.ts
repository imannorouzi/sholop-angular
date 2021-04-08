import { Component, OnInit } from '@angular/core';
import {NavigationService} from "../utils/navigation.service";

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.css']
})
export class FloatingButtonComponent implements OnInit {

  toggled = false;
  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
  }

  clickOutside(inside: boolean) {
    if(!inside) this.toggled = false;
  }

  route(url: string) {
    this.toggled = false;
    this.navigationService.navigate(url);
  }
}
