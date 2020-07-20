import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {User} from "../user";
import {environment} from "../../environments/environment.prod";
import {Venue} from "../venue";
import {AuthService} from "./auth.service";
import {catchError, map} from "rxjs/operators";

const serverUrl = environment.serverUrl;


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:HttpClient,
              private authService: AuthService) {}

  get jwtHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.jsonWebToken
    });
  }

  private extractData(res: Response) {
    let retVal =  (<any>res).data || (<any>res).entity || (<any>res).object;

    return retVal ? JSON.parse(retVal) : null;

  }

  private handleError(error: Response | any) {
    let message = error.error || error || "";
    return throwError(message);
  }

  getTinyEvents():  Observable<any> {
    let apiURL = serverUrl + "/get-events";
    return this.http.get(apiURL)
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getMeetings(date: Date):  Observable<any> {
    let apiURL = serverUrl + "/get-meetings";
    return this.http.get(apiURL, {
      params: {date: date.toUTCString()},
    })
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getTokens(date: Date):  Observable<any> {
    let apiURL = serverUrl + "/get-tokens";
    return this.http.get(apiURL, {
      params: {date: date.toUTCString()}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getMeeting(id: any) {
    let apiURL = serverUrl + "/get-meeting";
    return this.http.get(apiURL, {
      params: {meetingId: id}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getMeetingByUUID(uuid: any, action: string) {
    let apiURL = serverUrl + "/get-meeting-by-uuid";
    return this.http.get(apiURL, {
      params: {uuid: uuid, action: action}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getContacts( hint: string = ''):  Observable<any> {
    let apiURL = serverUrl + "/get-contacts";
    return this.http.get(apiURL, {
      params: {hint: hint}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getReception(text: string):  Observable<any> {
    let apiURL = serverUrl + "/get-reception";
    return this.http.get(apiURL, {
      params: {uuid: text},
    })
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getUsers( hint: string = ''):  Observable<any> {
    let apiURL = serverUrl + "/get-users";
    return this.http.get(apiURL, {
      params: {hint: hint}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getEmployees( hint: string = '', role: string = ''):  Observable<any> {
    let apiURL = serverUrl + "/get-employees";
    return this.http.get(apiURL, {
      params: {hint: hint, role: role}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  updateEmployee(emp: any) {
    let apiURL = serverUrl + "/update-employee";

    let employee = Object.assign({}, emp);
    let formData:FormData = new FormData();
    if(employee.image ) {
      formData.append('file', this.dataURItoBlob(employee.image), employee.fileName);
      formData.append("filename", employee.fileName);
      employee.image = null;
    }else{
      formData.append('file', null);
      formData.append("filename", "");
    }

    formData.append("employee", JSON.stringify(employee));

    let hdrs = new HttpHeaders();
    hdrs.append("Content-Type", "multipart/form-data");
    hdrs.append("Accept", "application/json");
    return this.http.post(`${apiURL}`, formData, {headers: hdrs})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteEmployee(id: number) {
    let apiURL = serverUrl + "/delete-employee";
    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, id, {headers: headers});
  }

  getVenues( hint: string = ''):  Observable<any> {
    let apiURL = serverUrl + "/get-venues";
    return this.http.get(apiURL, {
      params: {hint: hint}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteVenue(id: number) {
    let apiURL = serverUrl + "/delete-venue";
    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, id, {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  updateVenue(venue: Venue) {
    let apiURL = serverUrl + "/update-venue";

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, JSON.stringify(venue), {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));

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
      return this.http.post(`${apiURL}`, formData, {headers: headers})
        .pipe(map(this.extractData))
        .pipe(catchError(this.handleError));
    }
  }

  updateContact(con: any) {
    let apiURL = serverUrl + "/update-contact";

    let contact = Object.assign({}, con);
    let formData:FormData = new FormData();
    if(contact.image ) {
      formData.append('file', this.dataURItoBlob(contact.image), contact.fileName);
      formData.append("filename", contact.fileName);
      contact.image = null;
    }else{
      formData.append('file', null);
      formData.append("filename", "");
    }

    formData.append("contact", JSON.stringify(contact));

    let hdrs = new HttpHeaders();
    hdrs.append("Content-Type", "multipart/form-data");
    hdrs.append("Accept", "application/json");
    return this.http.post(`${apiURL}`, formData, {headers: hdrs})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
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
    return this.http.post(`${apiURL}`, formData, {headers: hdrs})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteContact(id: number) {
    let apiURL = serverUrl + "/delete-contact";
    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, id, {headers: headers});

  }

  postMeeting(event: any) {
    let apiURL = serverUrl + "/create-meeting";
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.jwtHeaders
    });
    return this.http.post(`${apiURL}`, JSON.stringify(event), {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getComments(eventId, page):  Observable<any> {
      let apiURL = serverUrl + "/get-comments/" + eventId + "/" + page;
      return this.http.get(apiURL, {}).pipe(map(this.extractData))
        .pipe(catchError(this.handleError));

  }
  getCommentsGuest(eventId, page, uuid):  Observable<any> {
      // It is a guest user
      let apiURL = serverUrl + "/get-comments-guest";
      return this.http.get(apiURL, {
        params: {event_id: eventId, page: page, uuid: uuid}
      });
  }

  getDatesByPeriod(startDate, endDate):  Observable<any> {
    let apiURL = serverUrl + "/get-meeting-dates";
    return this.http.get(apiURL, {
      params: {startDate: startDate.toUTCString(), endDate: endDate.toUTCString()}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteComment(comment: any) {
    let apiURL = serverUrl + "/delete-comment";
    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, comment.id, {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  postComment(comment : any){
    let apiURL;
    let headers = new HttpHeaders({
    });
    if(comment.uuid){
      apiURL = serverUrl + "/create-comment-guest";
      return this.http.post(`${apiURL}`, JSON.stringify(comment), {headers: headers}).pipe(map(this.extractData))
        .pipe(catchError(this.handleError));
    }else{
      apiURL = serverUrl + "/create-comment";
      return this.http.post(`${apiURL}`, JSON.stringify(comment), {headers: headers}).pipe(map(this.extractData))
        .pipe(catchError(this.handleError));
    }


  }


  updateContactStatus(contactEventId: number, status: string) {
    let apiURL;

    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });

    apiURL = serverUrl + "/update-contact-status";
    return this.http.post(`${apiURL}`, JSON.stringify({contactEventId: contactEventId, status: status}), {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  contactUs(message: { name: any; email: any; title: any; message: any }) {
    let apiURL = serverUrl + "/contact-us";

    let headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${apiURL}`, JSON.stringify(message), {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
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


}
