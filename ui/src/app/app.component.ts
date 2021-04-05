import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonService} from './utils/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ui';
  theme = 'light';

  constructor(private commonService: CommonService) {
  }

  ngOnInit(): void {
    this.commonService.themeChanged.subscribe(
      (theme: string) => this.theme = theme
    );
  }
}
