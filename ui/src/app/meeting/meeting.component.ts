import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateService} from "../utils/date.service";
import {CommentsComponent} from "../comments/comments.component";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../utils/data.service";
import {NavigationService} from "../utils/navigation.service";
import {CommonService} from "../utils/common.service";
import {AuthService} from "../utils/auth.service";

@Component({
  selector: 'meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit, OnChanges {
  @ViewChild("comments", {static: true}) comments: CommentsComponent;
  @ViewChild('gmap', {static: true}) gmapElement: any;

  @Input() event: any;
  @Input() anonymous: boolean;
  @Input() uuid: string;
  @Input() guest: any;

  map : google.maps.Map;
  currentUserId: string;
  markers : google.maps.Marker[] = [];


  constructor(public dateService: DateService,
              public commonService: CommonService,
              private route: ActivatedRoute,
              private dataService: DataService,
              private navigationService: NavigationService,
              private authService: AuthService) {
  }

  ngOnInit() {

    this.event.attendees.forEach(att => {
      att.status = this.getContactStatus(att.id);
    });

    this.currentUserId = this.authService.userId;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.event && changes.event.previousValue !== changes.event.currentValue){


    }
  }


  getContactStatus(id: number) : any {
    let contactEvent = this.event.contactEvents.find(ce => { return ce.contactId === id} );
    return this.commonService.getContactStatus(contactEvent.status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.event.id);
  }
}
