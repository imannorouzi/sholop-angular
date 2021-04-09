import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataService} from '../../utils/data.service';
import {ModalComponent} from '../../common-components/ng-modal/modal.component';
import {CommonService} from "../../utils/common.service";

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.css']
})
export class GuestListComponent implements OnInit {
  @ViewChild('selectContacts', {static: true}) public selectContacts: ModalComponent;

  @Output() onSelected: EventEmitter<any> = new EventEmitter();

  @Input() type = 'contact';
  filter = '';
  items: any[] = [];
  loading = false;

  constructor(private dataService: DataService,
              public commonService: CommonService) { }

  ngOnInit() {
    this.readitems();
  }

  readitems() {

    (this.type === 'contact' ?
        this.dataService.getContacts()
    :
        this.dataService.getUsers(this.filter)
    ).subscribe(
      data => {
        if (data.object && data.object ) {
          data.object.forEach(contact => {
            if(contact.imageUrl && this.commonService.getBase()){
              contact.imageUrl = this.commonService.getBase() + contact.imageUrl;
            }
            this.items.push(contact);
          });
        }
      },
      error1 => {
        console.log(error1);
      }
    );
  }

  selectAll(event) {
    event.preventDefault();
    this.items.forEach(contact => {
      contact.selected = true;
    });
  }

  getSelectedItems() {
    return this.items.filter(i => i.selected);
  }

}
