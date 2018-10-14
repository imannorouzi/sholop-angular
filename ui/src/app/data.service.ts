import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {RequestOptions, RequestOptionsArgs} from "@angular/http";


const serverUrl = "http://0.0.0.0:8094/api";
// const serverUrl = "/api";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient) {}

  // will return json string of tiny events
  getTinyEvents():  Observable<any> {
    let apiURL = serverUrl + "/get-events";
    return this.http.get(apiURL);
  }

  getContacts(userId):  Observable<any> {
    let apiURL = serverUrl + "/get-contacts";
    return this.http.get(apiURL, {
      params: {user_id: userId}
    });
  }

  postTinyEvent(event : any){

    let apiURL = serverUrl + "/create-tiny-event";

      // let formData:FormData = new FormData();
      // formData.append('file', event.image, event.image.name);
      // formData.append('eventString', "{}");
      // return this.http.post(apiURL, formData, httpOptions);

    if(event.image) {
      let file: File = event.image;
      let formData:FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append("contact", JSON.stringify(event));
      let headers = new HttpHeaders();
      /** In Angular 5, including the header Content-Type casn invalidate your request */
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      let options = new RequestOptions({headers: headers });

      return this.http.post(`${apiURL}`, formData, options);
    }
  }

  updateContact(contact: any) {
    let apiURL = serverUrl + "/update-contact";

    if(contact.image ) {
      let file: File = contact.image;
      let formData:FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append("contact", JSON.stringify(contact));
      let headers = new HttpHeaders();
      /** In Angular 5, including the header Content-Type casn invalidate your request */
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      let options = new RequestOptions({ headers: headers });

      return this.http.post(`${apiURL}`, formData, options);
    }
  }
}
