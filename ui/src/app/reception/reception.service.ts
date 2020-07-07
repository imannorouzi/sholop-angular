import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ReceptionService {
  private subject = new Subject<any>();
  receptionItemClick: Subject<any> = new Subject<any>();

  constructor(private router: Router) {
  }

  prompt(item: {event: undefined, contact: undefined} ) {
    this.subject.next(item);
  }

  getReception(): Observable<any> {
    return this.subject.asObservable();
  }
}
