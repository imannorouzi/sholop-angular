import {Component, OnInit, ViewChild} from '@angular/core';
import {CreateMeetingModalComponent} from "./create-meeting-modal/create-meeting-modal.component";
import {CommonService} from "./utils/common.service";
import {AuthService} from "./utils/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @ViewChild("createMeetingModal", {static: false}) createMeetingModal: CreateMeetingModalComponent;
  title = 'ui';
  theme = 'light';

  constructor(private commonService: CommonService,
              private authService: AuthService) {
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
