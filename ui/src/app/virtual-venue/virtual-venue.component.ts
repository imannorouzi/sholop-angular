import { Component, OnInit } from '@angular/core';
import {Venue} from "../venue";

@Component({
  selector: 'app-virtual-venue',
  templateUrl: './virtual-venue.component.html',
  styleUrls: ['./virtual-venue.component.css']
})
export class VirtualVenueComponent implements OnInit {

  link: string = '';
  imageUrl: string = '';
  venue: Venue;

  virtualVenues: any[] = [
    { name: 'Zoom', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Zoom.png'},
    { name: 'Skype', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Skype.png'},
    { name: 'Slack', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Slack.png'},
    { name: 'Google Hangouts', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Google-Hangouts.png'},
    { name: 'GoToMeeting', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/GoToMeeting.png'},
    { name: 'Microsoft Teams', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Microsoft-Teams.png'},
    { name: 'Facetime', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Facetime.png'},
    { name: 'Google Meet', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Google-Meet.png'},
    { name: 'FreeConferenceCall', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/FreeConferenceCall.png'},
    { name: 'Adobe Connect', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Adobe-Connect.png'},
    { name: 'Amazon Chime', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Amazon-Chime.jpg'},
    { name: 'Join.Me', icon: '', imageUrl: 'assets/images/virtual-meeting-platforms/Join.Me.png'},
    { name: 'Other', icon: '', imageUrl: 'assets/images/virtual-meeting.png'},
  ];
  constructor() { }

  ngOnInit(): void {
  }

  venueSelected(item: any) {
    let venue = new Venue();
    venue.farsiAddress1 = item.name;
    venue.link = item;
    venue.virtual = true;
    venue.mapUrl = item.imageUrl;

    this.venue = venue;
  }

  getVenue() {
    return this.venue;
  }

}
