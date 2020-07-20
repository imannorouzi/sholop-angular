import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationService} from "../utils/navigation.service";
import {environment} from "../../environments/environment";
import {AuthService} from "../utils/auth.service";
import {QrCodeScannerComponent} from "../qr-code-scanner/qr-code-scanner.component";
import {QrCodeService} from "../utils/qr-code.service";
import {DataService} from "../utils/data.service";
import {ConfirmComponent} from "../common-components/confirm/confirm.component";
import {ReceptionService} from "../reception/reception.service";
import {NavigationEnd, NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('scanner', {static: false}) scanner: QrCodeScannerComponent;
  @ViewChild('prompt', {static: false}) prompt: ConfirmComponent;

  version: string = environment.VERSION;
  loadingReception: boolean = false;
  sidebar: boolean = false;

  promptText: string = '';

  constructor(public navigationService: NavigationService,
              public authService: AuthService,
              private qrCodeService: QrCodeService,
              private dataService: DataService,
              private receptionService: ReceptionService,
              private router: Router) { }

  ngOnInit() {

    this.router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
        this.toggleSidebar(false)
      }
    });

    this.qrCodeService.qrCodeScanned
      .subscribe( (text:string) => {

        this.loadingReception = true;

        this.dataService.getReception(text)
          .subscribe(
            data => {
              if( data['msg'] === "OK"){
                this.receptionService.prompt(data['object']);
              }else if(data['msg'] === 'NOT_FOUND'){
                this.promptText = 'ملاقاتی برای کد وارد شده پیدا نشد!';
                this.prompt.show();
              }
              this.loadingReception = false;
            },
            error => {
              console.log(error);
              this.loadingReception = false;
              this.promptText = 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.';
              this.prompt.show();
            }
          )
      });
  }

  toggleSidebar(open = undefined){
    if(open === undefined){
      this.sidebar = !this.sidebar;
    }else{
      this.sidebar = open;
    }
  }
}
