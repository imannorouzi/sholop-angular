import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateService} from "../date.service";
import {CommentsComponent} from "../comments/comments.component";
import {UtilService} from "../util.service";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../data.service";
import {NavigationService} from "../navigation.service";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit, OnChanges {
  @ViewChild("comments") comments: CommentsComponent;
  @ViewChild('gmap') gmapElement: any;

  @Input() event: any;
  @Input() anonymous: boolean;
  @Input() uuid: string;
  @Input() guest: any;

  map : google.maps.Map;
  currentUserId: number;
  markers : google.maps.Marker[] = [];


  constructor(public dateService: DateService,
              public utilService: UtilService,
              private route: ActivatedRoute,
              private dataService: DataService,
              private navigationService: NavigationService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {

    this.event.attendees.forEach(att => {
      att.status = this.getContactStatus(att.id);
    });

    this.currentUserId = this.authenticationService.getUser().id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.event && changes.event.previousValue !== changes.event.currentValue){


    }
  }


  getContactStatus(id: number) : any {
    let contactEvent = this.event.contactEvents.find(ce => { return ce.contactId === id} );
    return this.utilService.getContactStatus(contactEvent.status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.event.id);
  }
}
