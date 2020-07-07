import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import {ReceptionService} from "./reception.service";

@Component({
  selector: 'app-reception',
  templateUrl: 'reception.component.html',
  styleUrls:['reception.component.css']
})

export class ReceptionComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  receptions: any = [];
  message: any;

  constructor(private receptionService: ReceptionService) { }

  ngOnInit() {
    this.subscription = this.receptionService.getReception().subscribe(reception => {
      this.receptions.push(reception)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeReception(item: any, index: any) {
    this.receptions.splice(index, 1);
  }

  receptionClicked(item: any, index: number) {
    this.receptionService.receptionItemClick.next(item);
    this.receptions.splice(index, 1);
  }
}
