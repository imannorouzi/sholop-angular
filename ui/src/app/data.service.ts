import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';

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

  getMeetings(date: Date):  Observable<any> {
    let apiURL = serverUrl + "/get-meetings";
    return this.http.get(apiURL, {
      params: {date: date.toUTCString()}
    });
  }

  getMeeting(id: any) {
    let apiURL = serverUrl + "/get-meeting";
    return this.http.get(apiURL, {
      params: {meetingId: id}
    });
  }

  getContacts( hint: string = ''):  Observable<any> {
    let apiURL = serverUrl + "/get-contacts";
    return this.http.get(apiURL, {
      params: {hint: hint}
    });
  }

  getVenues( hint: string = ''):  Observable<any> {
    let apiURL = serverUrl + "/get-venues";
    return this.http.get(apiURL, {
      params: {hint: hint}
    });
  }

  deleteVenue(id: number) {
    let apiURL = serverUrl + "/delete-venue";
    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, id, {headers: headers});
  }


  postTinyEvent(event : any){

    let apiURL = serverUrl + "/create-tiny-event";

    if(event.image) {
      let file: File = event.image;
      let formData:FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append("contact", JSON.stringify(event));
      formData.append("filename", JSON.stringify(event));

      let headers = new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      });
      return this.http.post(`${apiURL}`, formData, {headers: headers});
    }
  }

  updateContact(contact: any) {
    let apiURL = serverUrl + "/update-contact";

    let formData:FormData = new FormData();
    if(contact.image ) {
      formData.append('file', this.dataURItoBlob(contact.image), contact.fileName);
      contact.image = null;
      formData.append("filename", contact.fileName);
    }

    formData.append("contact", JSON.stringify(contact));

    let hdrs = new HttpHeaders();
    hdrs.append("Content-Type", "multipart/form-data");
    hdrs.append("Accept", "application/json");
    return this.http.post(`${apiURL}`, formData, {headers: hdrs});
  }

  deleteContact(id: number) {
    let apiURL = serverUrl + "/delete-contact";
    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, id, {headers: headers});

  }

  postMeeting(event: any) {
    let apiURL = serverUrl + "/create-meeting";
    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, JSON.stringify(event), {headers: headers});
  }

  getComments(eventId, page):  Observable<any> {
    let apiURL = serverUrl + "/get-comments";
    return this.http.get(apiURL, {
      params: {event_id: eventId, page: page}
    });
  }

  postComment(comment : any){

    let apiURL = serverUrl + "/create-comment";

    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${apiURL}`, JSON.stringify(comment), {headers: headers});
  }

  contactUs(message: { name: any; email: any; title: any; message: any }) {
    let apiURL = serverUrl + "/contact-us";

    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${apiURL}`, JSON.stringify(message), {headers: headers});
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }

  dateToString(date: Date) {
    return [date.getDate(), (date.getMonth()+1), date.getFullYear()].join('/');
  }


}
