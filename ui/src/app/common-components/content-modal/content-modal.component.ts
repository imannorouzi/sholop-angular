import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ModalDirective} from "ngx-bootstrap/modal";
@Component({
  selector: 'modal',
  templateUrl: './content-modal.component.html',
  styleUrls: ['./content-modal.component.css']
})
export class ContentModalComponent implements OnInit, OnDestroy {

  @ViewChild('searchModal', {static: false}) rootModal;
  @ViewChild('closeButton', {static: false}) closeButton;
  @ViewChild('scrollPane', {static: false}) scrollPane: ElementRef;
  @ViewChild('inputField', {static: false}) inputField;

  @Input() modalTitle : string = '';
  @Input() size : string = ' lg ';
  @Input() expand : boolean = false;
  @Input() maximizable : boolean = false;
  @Input() zIndex : number = 10;
  @Input() width : number = 10;
  @Output() onShown: EventEmitter<any> = new EventEmitter();
  @Output() onHidden: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  show(){
      return this.rootModal.show();
  }

  hide(){
    return this.rootModal.hide();
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(e: KeyboardEvent) {
    if(this.rootModal.isShown) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.rootModal.hide();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  onHide(event) {
    this.onHidden.emit(event);
    // This is added to fix a bug, backdrop is not removed when modal is closed
    this.removeElements( document.querySelectorAll(".modal-backdrop") );
  }

  removeElements = (elms) => elms.forEach(el => el.remove());

  onShow($event: ModalDirective) {
    this.onShown.emit($event)
  }

  ngOnDestroy(): void {
    this.removeElements( document.querySelectorAll(".modal-backdrop") );
  }
}
