import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../data.service";
import {User} from "../user";
import {SpinnerComponent} from "../spinner/spinner.component";
import {AddVenueComponent} from "../add-venue/add-venue.component";

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.css']
})
export class VenuesComponent implements OnInit {
  @ViewChild("spinner") spinner: SpinnerComponent;
  @ViewChild("editVenue") editVenue: AddVenueComponent;

  venues: any[] = [];
  loading: boolean = false;
  selectedVenue;

  currentUser: User;
  searchString: string = '';

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.readVenues('');
    // this.loadAllUsers();
  }

  readVenues(hint: string){

    this.loading = true;

    this.dataService.getVenues(hint).subscribe(
      data => {
        if(data.msg === "OK") {

          this.venues = [];

          data.object.forEach(contact => {
            this.venues.push(contact);
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

  deleteVenue(id: number, index: number) {
    this.dataService.deleteVenue(id).subscribe(
      data => {
        this.venues.splice(index, 1);
      },
      error1 => {
        console.log(error1);
        this.spinner.hide();
      }
    )
  }

  /*private loadAllUsers() {
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.users = users;
    });
  }*/

  onVenueAdded(venue){
    this.venues.push(venue);
  }

  onVenueEdited(venue){
    // this.venues.push(venue);
  }

  onDeleteVenue(id: any, index: number, event) {
    event.preventDefault();
    this.deleteVenue(id, index);
  }

  onKeyUp(event){
    if(event.keyCode === 13) {
      this.readVenues(this.searchString)
    }
  }

  onEditVenue(venue: any) {
    event.preventDefault();
    this.editVenue.show(venue);
  }
}
