import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from "./user";
import {environment} from "../environments/environment.prod";

const serverUrl = environment.serverUrl;


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

  getMeetingByUUID(uuid: any, action: string) {
    let apiURL = serverUrl + "/get-meeting-by-uuid";
    return this.http.get(apiURL, {
      params: {uuid: uuid, action: action}
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

  updateUser(user: User) {
    let apiURL = serverUrl + "/update-user";

    let formData:FormData = new FormData();
    if(user.image ) {
      formData.append('file', this.dataURItoBlob(user.image), user.fileName);
      user.image = null;
      formData.append("filename", user.fileName);
    }

    formData.append("user", JSON.stringify(user));

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

  getComments(eventId, page, uuid):  Observable<any> {
    if(uuid){
      // It is a guest user
      let apiURL = serverUrl + "/get-comments-guest";
      return this.http.get(apiURL, {
        params: {event_id: eventId, page: page, uuid: uuid}
      });
    }else{
      let apiURL = serverUrl + "/get-comments";
      return this.http.get(apiURL, {
        params: {event_id: eventId, page: page}
      });
    }

  }

  getDatesByPeriod(startDate, endDate):  Observable<any> {
    let apiURL = serverUrl + "/get-meeting-dates";
    return this.http.get(apiURL, {
      params: {startDate: startDate.toUTCString(), endDate: endDate.toUTCString()}
    });
  }

  deleteComment(comment: any) {
    let apiURL = serverUrl + "/delete-comment";
    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, comment.id, {headers: headers});
  }

  postComment(comment : any){

    let apiURL;

    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });

    if(comment.uuid){
      //It is a guest
      apiURL = serverUrl + "/create-comment-guest";
      return this.http.post(`${apiURL}`, JSON.stringify(comment), {headers: headers});
    }else{
      apiURL = serverUrl + "/create-comment";
      return this.http.post(`${apiURL}`, JSON.stringify(comment), {headers: headers});
    }


  }


  updateContactStatus(contactEventId: number, status: string) {
    let apiURL;

    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });

    apiURL = serverUrl + "/update-contact-status";
    return this.http.post(`${apiURL}`, JSON.stringify({contactEventId: contactEventId, status: status}), {headers: headers});
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
