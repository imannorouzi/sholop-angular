import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {User} from '../user';
import {environment} from '../../environments/environment';
import {Venue} from '../venue';
import {AuthService} from './auth.service';
import {catchError, map} from 'rxjs/operators';

const serverUrl = environment.serverUrl;


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  get jwtHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.jsonWebToken
    });
  }

  private extractData(res: Response) {
    const retVal =  (<any>res).data || (<any>res).entity || (<any>res).object;

    return retVal ? JSON.parse(retVal) : null;

  }

  private handleError(error: Response | any) {
    const message = error.error || error || '';
    return throwError(message);
  }

  getTinyEvents():  Observable<any> {
    const apiURL = serverUrl + '/get-events';
    return this.http.get(apiURL)
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getMeetings(params):  Observable<any> {
    const apiURL = serverUrl + '/get-meetings';
    return this.http.get(apiURL, {
      params: params,
    })
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getContactEventMeeting(uuid: string) {
    const apiURL = serverUrl + '/get-contact-event-meeting/' + uuid;
    return this.http.get(apiURL, {
      params: {},
    })
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getTokens(date: Date):  Observable<any> {
    const apiURL = serverUrl + '/get-tokens';
    return this.http.get(apiURL, {
      params: {date: date.toUTCString()}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getMeeting(id: any) {
    const apiURL = serverUrl + '/get-meeting';
    return this.http.get(apiURL, {
      params: {meetingId: id}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getMeetingByUUID(uuid: any, action: string) {
    const apiURL = serverUrl + '/get-meeting-by-uuid';
    return this.http.get(apiURL, {
      params: {uuid: uuid, action: action}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getContacts( hint: string = ''):  Observable<any> {
    const apiURL = serverUrl + '/get-contacts';
    return this.http.get(apiURL, {
      params: {hint: hint}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getReception(text: string):  Observable<any> {
    const apiURL = serverUrl + '/get-reception';
    return this.http.get(apiURL, {
      params: {uuid: text},
    })
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getUsers( hint: string = ''):  Observable<any> {
    const apiURL = serverUrl + '/get-users';
    return this.http.get(apiURL, {
      params: {hint: hint}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getEmployees( hint: string = '', role: string = ''):  Observable<any> {
    const apiURL = serverUrl + '/get-employees';
    return this.http.get(apiURL, {
      params: {hint: hint, role: role}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  updateEmployee(emp: any) {
    const apiURL = serverUrl + '/update-employee';

    const employee = Object.assign({}, emp);
    const formData: FormData = new FormData();
    if (employee.image ) {
      formData.append('file', this.dataURItoBlob(employee.image), employee.fileName);
      formData.append('filename', employee.fileName);
      employee.image = null;
    } else {
      formData.append('file', null);
      formData.append('filename', '');
    }

    formData.append('employee', JSON.stringify(employee));

    const hdrs = new HttpHeaders();
    hdrs.append('Content-Type', 'multipart/form-data');
    hdrs.append('Accept', 'application/json');
    return this.http.post(`${apiURL}`, formData, {headers: hdrs})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteEmployee(id: number) {
    const apiURL = serverUrl + '/delete-employee';
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, id, {headers: headers});
  }

  getVenues( hint: string = ''):  Observable<any> {
    const apiURL = serverUrl + '/get-venues';
    return this.http.get(apiURL, {
      params: {hint: hint}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteVenue(id: number) {
    const apiURL = serverUrl + '/delete-venue';
    const headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, id, {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  updateVenue(venue: Venue) {
    const apiURL = serverUrl + '/update-venue';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, JSON.stringify(venue), {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));

  }


  postTinyEvent(event: any) {

    const apiURL = serverUrl + '/create-tiny-event';

    if (event.image) {
      const file: File = event.image;
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('contact', JSON.stringify(event));
      formData.append('filename', JSON.stringify(event));

      const headers = new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      });
      return this.http.post(`${apiURL}`, formData, {headers: headers})
        .pipe(map(this.extractData))
        .pipe(catchError(this.handleError));
    }
  }

  updateContact(con: any) {
    const apiURL = serverUrl + '/update-contact';

    const contact = Object.assign({}, con);
    const formData: FormData = new FormData();
    if (contact.image ) {
      formData.append('file', this.dataURItoBlob(contact.image), contact.fileName);
      formData.append('filename', contact.fileName);
      contact.image = null;
    } else {
      formData.append('file', null);
      formData.append('filename', '');
    }

    formData.append('contact', JSON.stringify(contact));

    const hdrs = new HttpHeaders();
    hdrs.append('Content-Type', 'multipart/form-data');
    hdrs.append('Accept', 'application/json');
    return this.http.post(`${apiURL}`, formData, {headers: hdrs})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  updateUser(user: User) {
    const apiURL = serverUrl + '/update-user';

    const formData: FormData = new FormData();
    if (user.image ) {
      formData.append('file', this.dataURItoBlob(user.image), user.fileName);
      user.image = null;
      formData.append('filename', user.fileName);
    }

    formData.append('user', JSON.stringify(user));

    const hdrs = new HttpHeaders();
    hdrs.append('Content-Type', 'multipart/form-data');
    hdrs.append('Accept', 'application/json');
    return this.http.post(`${apiURL}`, formData, {headers: hdrs})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteContact(id: number) {
    const apiURL = serverUrl + '/delete-contact';
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, id, {headers: headers});

  }

  postMeeting(event: any) {
    const apiURL = serverUrl + '/create-meeting';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.jwtHeaders
    });
    return this.http.post(`${apiURL}`, JSON.stringify(event), {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getComments(eventId, page):  Observable<any> {
      const apiURL = serverUrl + '/get-comments/' + eventId + '/' + page;
      return this.http.get(apiURL, {}).pipe(map(this.extractData))
        .pipe(catchError(this.handleError));

  }
  getCommentsGuest(eventId, page, uuid):  Observable<any> {
      // It is a guest user
      const apiURL = serverUrl + '/get-comments-guest';
      return this.http.get(apiURL, {
        params: {event_id: eventId, page: page, uuid: uuid}
      });
  }

  getDatesByPeriod(startDate, endDate):  Observable<any> {
    const apiURL = serverUrl + '/get-meeting-dates';
    return this.http.get(apiURL, {
      params: {startDate: startDate.toUTCString(), endDate: endDate.toUTCString()}
    }).pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteComment(comment: any) {
    const apiURL = serverUrl + '/delete-comment';
    const headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${apiURL}`, comment.id, {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  postComment(comment: any) {
    let apiURL;
    const headers = new HttpHeaders({
    });
    if (comment.uuid) {
      apiURL = serverUrl + '/create-comment-guest';
      return this.http.post(`${apiURL}`, JSON.stringify(comment), {headers: headers}).pipe(map(this.extractData))
        .pipe(catchError(this.handleError));
    } else {
      apiURL = serverUrl + '/create-comment';
      return this.http.post(`${apiURL}`, JSON.stringify(comment), {headers: headers}).pipe(map(this.extractData))
        .pipe(catchError(this.handleError));
    }


  }


  updateContactStatus(contactEventId: number, status: string) {
    let apiURL;

    const headers = new HttpHeaders({
      'Content-Type': 'text/json',
      'Accept': 'application/json'
    });

    apiURL = serverUrl + '/update-contact-status';
    return this.http.post(`${apiURL}`, JSON.stringify({contactEventId: contactEventId, status: status}), {headers: headers})
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  contactUs(message: { name: any; email: any; title: any; message: any }) {
    const apiURL = serverUrl + '/contact-us';

    const headers = new HttpHeaders({
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
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type: mimeString});
  }

}
