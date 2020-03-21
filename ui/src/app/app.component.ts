import {Component, OnInit, ViewChild} from '@angular/core';
import { environment } from "../environments/environment.prod";
import {CommonService} from "./common.service";
import {CreateMeetingModalComponent} from "./create-meeting-modal/create-meeting-modal.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild("createMeetingModal", {static: false}) createMeetingModal: CreateMeetingModalComponent;
  title = 'ui';
  theme = 'light';

  constructor(private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.commonService.themeChanged.subscribe(
      (theme: string) => this.theme = theme
    )

    this.commonService.createMeeting.subscribe(
      () => this.createMeetingModal.show()
    )
  }
}
