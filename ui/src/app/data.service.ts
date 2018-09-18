import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';

const serverUrl = "http://0.0.0.0:8094/api"

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) {}

  // Uses http.get() to load data from a single API endpoint
  getDummy():  Observable<any> {
    let apiURL = serverUrl;
    return this.http.get(apiURL);
  }

  postTinyEvent(event : any){
    let apiURL = serverUrl + "/create-tiny-event";
    return this.http.post(apiURL, event, httpOptions);
  }
}
