import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Venue} from "../venue";
import {MapComponent} from "../map/map.component";
import {VirtualVenueComponent} from "../virtual-venue/virtual-venue.component";

@Component({
  selector: 'app-select-venue',
  templateUrl: './select-venue.component.html',
  styleUrls: ['./select-venue.component.css']
})
export class SelectVenueComponent implements OnInit {
  @ViewChild('map') map: MapComponent;
  @ViewChild('virtualVenue') virtualVenue: VirtualVenueComponent;

  tab: number = 2;

  constructor() { }

  ngOnInit(): void {
  }

  getVenue() {

    switch (this.tab){
      case 1: // virtual
        return this.virtualVenue.getVenue();
      case 2: // physical
        return  this.map.getVenue();

      default:
        return null;
    }
  }
}
