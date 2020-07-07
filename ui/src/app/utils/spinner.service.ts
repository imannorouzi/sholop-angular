import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private subject = new Subject<any>();
  constructor() { }

  changeState(state: boolean) {
    this.subject.next(state);
  }

  getState(): Observable<any> {
    return this.subject.asObservable();
  }
}
