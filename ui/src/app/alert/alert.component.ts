import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService} from "../alert.service";

@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html',
  styleUrls:['alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  alerts: any = [];
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.alerts.push({message: message})

      setTimeout( () => {
        this.alerts.splice(0, 1);
      })
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
