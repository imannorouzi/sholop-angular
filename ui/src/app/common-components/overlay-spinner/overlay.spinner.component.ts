import {Component, Input} from '@angular/core';

@Component({
  selector: 'overlay-spinner',
  templateUrl: './overlay.spinner.component.html',
  styleUrls: [ './overlay.spinner.component.css' ]
})
export class OverlaySpinnerComponent {
  @Input() text: string = '';
}
