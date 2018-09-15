import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';



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
    let apiURL = "http://185.173.104.77:8094/api/";
    return this.http.get(apiURL);
  }
}
