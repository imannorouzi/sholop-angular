import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../utils/data.service";
import {SpinnerComponent} from "../spinner/spinner.component";
import {DateService} from "../utils/date.service";
import {DummyData} from "../dummyData";
import {TokenItemModalComponent} from "../token-item-modal/token-item-modal.component";

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensComponent implements OnInit {
  @ViewChild('spinner', {static: true}) spinner: SpinnerComponent;
  @ViewChild('tokenModal', {static: true}) tokenModal: TokenItemModalComponent;

  tokens = [];
  loading = false;

  selectedToken = undefined;

  selectedDate: any;

  constructor(private dataService : DataService,
              public dateService: DateService) { }

  ngOnInit() {

    let d = new Date();
    let date = new Date(d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );
    this.onDateChanged(date);
  }

  readTokenss(date){
    this.tokens = [];
    this.loading = true;

    this.dataService.getTokens(date).subscribe(
      data => {
        data.object.forEach( event => {
          this.tokens.push(event);
        });
        this.loading = false;
      },
      error1 => {
        console.log(error1);
        this.loading = false;
      }
    )
  }

  onDateChanged(date: any) {
    // this.readMeetings(date);

    this.tokens = [];
    this.readDummyTokens(date);

    this.selectedDate = date;
  }

  onTokenClick(event: any){
    this.selectedToken = event;

    this.tokenModal.show();

  }

  private readDummyTokens(date: any) {
    this.loading = true;

    setTimeout( () => {
      this.loading = false;
      this.tokens = DummyData.TOKENS;
    }, 1500);

  }
}
