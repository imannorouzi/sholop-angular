import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataService} from "../../utils/data.service";
import {ModalComponent} from "../../common-components/ng-modal/modal.component";

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.css']
})
export class GuestListComponent implements OnInit {
  @ViewChild('selectContacts', {static: true}) public selectContacts: ModalComponent;

  @Output() onSelected: EventEmitter<any> = new EventEmitter();

  @Input() type: string = 'contact';
  filter: string = '';
  items: any[] = [];
  loading: boolean = false;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.readitems();
  }

  readitems(){

    (this.type==='contact' ?
        this.dataService.getContacts()
    :
        this.dataService.getUsers(this.filter)
    ).subscribe(
      data => {
        data.object.forEach( contact => {
          this.items.push(contact);
        });
      },
      error1 => {
        console.log(error1);
      }
    )
  }

  selectAll(event){
    event.preventDefault();
    this.items.forEach(contact => {
      contact.selected = true;
    });
  }

  getSelectedItems(){
    return this.items.filter(i => i.selected);
  }

}
