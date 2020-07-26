import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from "../common-components/ng-modal/modal.component";
import {QrCodeService} from "../utils/qr-code.service";
import {ZXingScannerComponent} from "@zxing/ngx-scanner";

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent implements OnInit {
  @ViewChild('scannerModal', {static: true}) modal: ModalComponent;
  // @ViewChild('scanner', {static: true}) scanner: ZXingScannerComponent;

  isShown: boolean = false;
  constructor(private qrCodeService: QrCodeService) { }

  ngOnInit() {
  }

  show(){

    this.modal.show();
  }

  hide(){
    this.modal.hide();
  }

  scanComplete(result) {
    /*
    * format: 11
      numBits: 440
      rawBytes: Uint8Array(55) [66, 67, 131, 22, 35, 35, 99, 38, 99, 66, 211, 6, 83, 99, 130, 211, 67, 51, 54, 82, 211, 131, 150, 19, 2, 211, 131, 19, 38, 99, 35, 3, 22, 83, 6, 86, 54, 32, 236, 17, 236, 17, 236, 17, 236, 17, 236, 17, 236, 17, 236, 17, 236, 17, 236]
      resultMetadata: Map(2) {2 => Array(1), 3 => "L"}
      resultPoints: (4) [FinderPattern, FinderPattern, FinderPattern, AlignmentPattern]
      text: "81b262f4-0e68-433e-89a0-812f201e0ecb"
      timestamp: 1595044559015
      * */

    if(result){
      this.qrCodeService.qrCodeScanned.next(result.text);
      this.hide();
    }
  }

  changed(event: boolean) {
    this.isShown = event;
    if(event){
    }
  }
}
