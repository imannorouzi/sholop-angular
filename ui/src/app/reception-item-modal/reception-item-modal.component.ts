import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DateService} from "../utils/date.service";
import {NavigationService} from "../utils/navigation.service";
import {ReceptionService} from "../reception/reception.service";
import {CommonService} from "../utils/common.service";
import {ModalComponent} from "../common-components/ng-modal/modal.component";

@Component({
  selector: 'reception-item-modal',
  templateUrl: './reception-item-modal.component.html',
  styleUrls: ['./reception-item-modal.component.css']
})
export class ReceptionItemModalComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('childModal', {static: true}) public childModal: ModalComponent;
  @ViewChild('canvas', {static: true}) public canvas: ElementRef;

  @Input() item: any = {
    event: undefined,
    contact: undefined
  };

  constructor(public dateService: DateService,
              private receptionService: ReceptionService,
              public commonService: CommonService,
              private navigationService: NavigationService) {

    this.receptionService.receptionItemClick.subscribe(
      item => {
        this.item = item;
        this.show();
      }
    )
  }

  show(){
    this.childModal.show();
    setTimeout( () => {
      // let context = this.canvas.nativeElement.getContext("2d");
      let canvas = <HTMLCanvasElement>document.getElementById('canvas');
      let context = (canvas).getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      let userImage = new Image();
      userImage.src = this.item.contact.imageUrl ? this.item.contact.imageUrl : '../assets/images/user-placeholder.png';
      userImage.onload = function(){
        context.drawImage(userImage, 380, 20, 100, 100);
      }

      context.textAlign = "right";
      context.fillStyle = "#000"
      context.font = "30px sholop-font";
      context.fillText(this.item.contact.name, 370, 60);

      context.font = "20px sholop-font";
      context.fillText(this.item.contact.email, 370, 100);


      context.strokeStyle = "#bdbbbb";
      context.beginPath();
      context.moveTo(20, 140);
      context.lineTo(480, 140);
      context.stroke()


      let timeString = '';
      if(this.item.event.pointedDate){
        let dateObj = this.item.event.pointedDate;

        timeString += dateObj.date ? this.dateService.greToPersian(dateObj.date, true) : '';
        timeString += dateObj.startTime ? ' از ' + this.dateService.getTimeFromDateString(dateObj.startTime) : '';
        timeString += dateObj.endTime ? ' تا ' + this.dateService.getTimeFromDateString(dateObj.endTime) : '';
      }


      context.textAlign = "center";
      context.fillStyle = "bold"
      context.font = "25px sholop-font";
      context.fillText(this.item.event.title, 250, 170);
      // context.fillText(this.item.event.title, 480, 170);

      context.font = "20px sholop-font";
      context.fillText(timeString, 250, 200);

      /***** chair ****/

      context.textAlign = "right";
      let chairImage = new Image();
      chairImage.src = this.item.event.chair && this.item.event.chair.imageUrl ?
        this.item.event.chair.imageUrl : '../assets/images/user-placeholder.png';
      chairImage.onload = function(){
        context.drawImage(chairImage, 410, 220, 70, 70);
      }

      context.font = "20px bold bold sholop-font";
      context.fillText(this.item.event.chair ? this.item.event.chair.name : 'مشخص نشده', 400, 240);

      context.fillStyle = "#555"
      context.font = "15px sholop-font";
      context.fillText(this.item.contact.email, 400, 260);

      context.font = "15px sholop-font";
      context.fillText('میزبان', 400, 280);

      context.textAlign = "left";
      context.font = "10px sholop-font";
      console.log(this.item.event);
      context.fillText((this.item.event.venue ?
        (this.item.event.venue.farsiAddress1 + '، ' + this.item.event.venue.farsiAddress2) : ''), 20, 320);


      context.strokeStyle = "#333";
      context.strokeRect(0, 0, 500, 335);
    })
  }

  hide(){
    this.childModal.hide();
  }

  ngOnInit() {


  }

  ngAfterViewInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.item && changes.event.previousValue !== changes.event.currentValue){

      this.item.event.attendees.forEach(att => {
        att.status = this.getContactStatus(att.id);
      });

    }
  }


  getContactStatus(id: number) : any {
    let contactEvent = this.item.event.contactEvents.find(ce => { return ce.contactId === id} );
    let status = '';
    if(contactEvent){
      status = contactEvent.status;
    }

    return this.commonService.getContactStatus(status);
  }

  goTo(url) {
    this.navigationService.navigate(url, this.item.event.id);
  }

  print() {
    const dataUrl = (<HTMLCanvasElement>document.getElementById('canvas')).toDataURL();

    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    windowContent += '<head></head>';
    windowContent += '<body>';
    windowContent += '<img src="' + dataUrl + '">';
    windowContent += '</body>';
    windowContent += '</html>';

    const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
    printWin.document.open();
    printWin.document.write(windowContent);

    printWin.document.addEventListener('load', function() {
      printWin.focus();
      printWin.print();
      printWin.document.close();
      printWin.close();
    }, true);
  }
}
