import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SpinnerComponent} from "../spinner/spinner.component";
import {DataService} from "../utils/data.service";

@Component({
  selector: 'suggesting-item-input',
  templateUrl: './suggesting-item-input.component.html',
  styleUrls: ['./suggesting-item-input.component.css']
})
export class SuggestingItemInputComponent implements OnInit {
  @ViewChild("spinner", {static: true}) spinner: SpinnerComponent;

  @Input() type: string = 'users';
  @Input() guestsHint: string = '';
  @Input() items: any[] = [];
  showing: boolean = false;
  loading: boolean = false;

  selectedIndex = 0;

  @Output() itemSelected: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  hide(){
    this.showing = false;
  }

  show(){
    this.showing = true;
  }

  setDisplay(value: boolean = false){
    this.showing = value;
  }

  onItemSelected(index = undefined) {
    this.showing = false;
    if(index != undefined) this.selectedIndex = index;
    if(this.selectedIndex >=0 && this.selectedIndex<this.items.length){

      this.itemSelected.emit(this.items[this.selectedIndex]);
    }else{
      this.itemSelected.emit(undefined);
    }
  }

  outsideClicked(inside: boolean) {
    if(!inside) this.hide();
  }

  onKeyUp(event: KeyboardEvent){
    switch (event.keyCode) {

      case 13: // Enter
        if(this.items.length > this.selectedIndex) this.onItemSelected();
        break;

        case 27: // Esc
        this.showing = false;
        break;

      case 38: // Arrow Up
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        break;

      case 40: // Arrow Down
        this.selectedIndex = Math.min(this.items.length-1, this.selectedIndex + 1);
        break;

      default:
        this.showing = true;
    }
    event.preventDefault();
  }
}
