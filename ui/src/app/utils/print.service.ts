import { Injectable } from '@angular/core';
import {Observable, Subject, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AlertService} from "../alert.service";

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor(private http: HttpClient,
              private alertService: AlertService) { }

  print: Subject<any> = new Subject<any>();


  printImage(filename, params, type){

    let payload = {
      'name': 'image-report',
      'params': params
    };

    this.download(filename, payload, type);
  }

  printTable(filename, params, type) {

    let payload = {
      'name': 'table-report',
      'params': params
    };

    this.download(filename, payload, type);
  }


  download(filename, payload, type){
    this.downloadReport(payload, type)
      .subscribe(
        (data: Blob) => {
          if(window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveOrOpenBlob(data, filename + (new Date()).toISOString().slice(0,10).replace(/-/g,"")+'.' + type);
          }else if(type === 'pdf'){
            let url = window.URL.createObjectURL(data);
            window.open(url, "_blank");

            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 100);
          }else{
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(data);
            link.download = filename + '.' + type;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        },
        error => {
          this.alertService.error("Unable to download printed file.")
          console.log(error);
        });
  }

  downloadReport(payload, type): Observable<Blob> {
    let url = environment.baseUrl + '/print/' + type;

    return this.http.post(url, payload, {responseType: 'blob'})
      .pipe(catchError(this.handleError));
  }


  private handleError(error: Response | any) {
    let message = error.error || "";
    return throwError(message);
  }

}
