import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateService} from "../date.service";
import {CommentsComponent} from "../comments/comments.component";
import {UtilService} from "../util.service";
import {ActivatedRoute} from "@angular/router";
import {SpinnerComponent} from "../spinner/spinner.component";
import {DataService} from "../data.service";
import {NavigationService} from "../navigation.service";

@Component({
  selector: 'meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit, OnChanges {
  @ViewChild("spinner") spinner: SpinnerComponent;
  @ViewChild("comments") comments: CommentsComponent;
  @ViewChild('gmap') gmapElement: any;

  event: any;
  loading: boolean = false;
  map : google.maps.Map;
  markers : google.maps.Marker[] = [];


  constructor(public dateService: DateService,
              public utilService: UtilService,
              private route: ActivatedRoute,
              private dataService: DataService,
              private navigationService: NavigationService) {
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.readMeeting(params['id']);
    });
  }

  readMeeting(id){
    this.loading = true;
    this.spinner.show();

    this.dataService.getMeeting(id).subscribe(
      data => {
        if( data['msg'] === "OK"){
          this.event = data['object'];
        }
        this.spinner.hide();
        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.spinner.hide();
        this.loading = false;
      }
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.event && changes.event.previousValue !== changes.event.currentValue){

      setTimeout( () => {
        let mapProp = {
          center: new google.maps.LatLng(this.event.location.latitude, this.event.location.longitude),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
      }, 0);

    }
  }


  getContactStatus(id: number) {
    let contact = this.event.attendees.find(contact => { return contact.id === id} );
    return this.utilService.getContactStatus(contact.status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.event.id);
  }
}
