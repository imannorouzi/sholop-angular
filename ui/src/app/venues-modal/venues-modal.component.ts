import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DataService} from "../utils/data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {ModalComponent} from "../common-components/ng-modal/modal.component";

@Component({
  selector: 'venues-modal',
  templateUrl: './venues-modal.component.html',
  styleUrls: ['./venues-modal.component.css']
})
export class VenuesModalComponent implements OnInit {
  @ViewChild('selectVenues', {static: true}) public selectVenues: ModalComponent;
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;

  @Output() onSelected: EventEmitter<any> = new EventEmitter();

  venues: any[] = [];
  loading: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit() {

  }

  readVenues(){
    this.loading = true;


    this.dataService.getVenues().subscribe(
      data => {
        if(data.msg === "OK"){
          this.venues = [];

          data.object.forEach( venue => {
            this.venues.push(venue);
          });
        }
        this.loading = false;

      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    )
  }

  show(){
    this.selectVenues.show();
    this.readVenues();
  }

  hide(){
    this.selectVenues.hide();
  }

  onVenueSelected(venue){
    this.onSelected.emit(venue);
    this.hide();
  }

}
