import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SpinnerComponent} from "../spinner/spinner.component";
import {DataService} from "../utils/data.service";

@Component({
  selector: 'suggesting-contact-input',
  templateUrl: './suggesting-contact-input.component.html',
  styleUrls: ['./suggesting-contact-input.component.css']
})
export class SuggestingContactInputComponent implements OnInit {
  @ViewChild("spinner", {static: true}) spinner: SpinnerComponent;

  contacts: any[] = [];
  inputValue: string = '';
  showing: boolean = false;
  loading: boolean = false;

  selectedIndex = -1;
  selectedContact = undefined;

  @Output() contactSelected: EventEmitter<any> = new EventEmitter();

  constructor(private dataService: DataService) { }

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

  onKeyUp(event: KeyboardEvent){
    switch (event.keyCode) {

      case 13: // Enter
        this.onContactSelected(this.contacts[this.selectedIndex])
        break;

      case 38: // Arrow Up
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        break;

      case 40: // Arrow Down
        this.selectedIndex = Math.min(this.contacts.length-1, this.selectedIndex + 1);
        break;

      default:
        this.showing = true;
        this.readContacts();
    }
    event.preventDefault();
  }

  readContacts(){

    this.loading = true;
    this.dataService.getContacts(this.inputValue).subscribe(
      data => {
        if(data.msg === "OK"){
          this.contacts = data.object;
        }

        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    )
  }

  onContactSelected(contact: any) {
    this.showing = false;
    this.inputValue = contact.name;
    this.selectedContact = contact;
    this.contactSelected.emit(contact);
  }

  outsideClicked(inside: boolean) {
    if(!inside) this.hide();
  }
}
