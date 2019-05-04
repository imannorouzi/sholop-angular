import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {Subscription} from "rxjs";
import {SpinnerService} from "../spinner.service";

@Component({
  selector: 'spinner-modal',
  templateUrl: './spinner-modal.component.html',
  styleUrls: ['./spinner-modal.component.css']
})
export class SpinnerModalComponent implements OnInit, OnDestroy {
  @ViewChild('childModal') public childModal:ModalDirective;

  private subscription: Subscription;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.subscription = this.spinnerService.getState().subscribe(state => {
      if(state){
        this.childModal.show();
      }else{
        this.childModal.hide();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
