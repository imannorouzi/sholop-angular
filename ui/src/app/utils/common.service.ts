import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";


const serverUrl = environment.serverUrl;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  themeChanged: Subject<string> = new Subject<string>();
  createMeeting: Subject<any> = new Subject<any>();

  constructor() { }

  detectIEEdge() : number{
    let ua = window.navigator.userAgent;

    let msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    let trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      let rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    let edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return 0;
  }

  sortByKey(array, key = undefined, order="asc") {

    let sorted = Object.assign([], array);
    if(key){
      sorted = sorted.map( i => i[key] );
    }
    let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    sorted = sorted.sort(collator.compare);

    let retVal = [];
    if(key){
      let buffer = Object.assign([], array);
      sorted.forEach( s => {
        let item = buffer.find(b => b[key] === s);
        if(item){
          retVal.push(item);
          buffer.splice(buffer.indexOf(item), 1);
        }
      })
    }else{
      retVal = sorted;
    }

    return retVal;
  }

  getTimeDuration(startTime, endTime): string{

    if(startTime && endTime) {
      let startSeconds = parseInt(startTime.substring(0, 2)) * 60 + parseInt(startTime.substring(2));
      let endSeconds = parseInt(endTime.substring(0, 2)) * 60 + parseInt(endTime.substring(2));

      let minus = endSeconds - startSeconds;

      let hour = Math.floor(minus / 60);
      let minutes = minus % 60;

      if (hour === 0) {
        return minutes + ' دقیقه';
      } else {
        return hour + ' ساعت' + (minutes > 0 ? ' و ' + minutes + ' دقیقه' : '');
      }
    }

    return '';
  }

  getStatusString(status: string){
    switch(status){
      case 'draft':
        return 'پیش نویس';
      case 'publish':
        return 'فعال';
      case 'cancel':
        return 'لغو شده';
    }
  }

  getContactStatus(status: string) {
    switch(status){
      case 'NOT_REPLIED':
        return {text:  'جواب نداده', color: 'gray', class: 'fa-question'};
      case 'ATTENDING':
        return {text:  'میام', color: 'green', class: 'fa-check'};
      case 'NOT_ATTENDING':
        return {text:  'نمیام', color: 'red', class: 'fa-close'};
      case 'TENTATIVE':
        return {text:  'شاید', color: 'orange', class: 'fa-exclamation'};

      default:
        return {text:  'نامشخص', color: 'gray', class: ''};
    }
  }

  getRandomColor(){
    let colors = ['red', 'green', 'blue', 'orange', 'yellow'];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  getEventStatus(status: string){
    switch(status){
      case 'DONE':
        return {text:  'انجام شده', color: '#0b170b', class: 'fa-question'};
      case 'GOING_ON':
        return {text:  'در حال انجام', color: '#0b170b', class: 'fa-check'};
      case 'GETTING_LATE':
        return {text:  '', color: '#3d3911', class: 'fa-close'};
      case 'LATE':
        return {text:  '', color: '#281414', class: 'fa-exclamation'};
      case 'CANCELLED':
        return {text:  'لغو شده', color: '', class: 'fa-exclamation'};
      case 'TO_BE':
        return {text:  '', color: '', class: 'fa-exclamation'};
      case 'VALID':
        return {text:  '', color: '', class: 'fa-exclamation'};
      case 'EXPIRED':
        return {text:  'منقضی شده', color: '#281414', class: 'fa-exclamation'};

      default:
        return {text:  'نامشخص', color: 'gray', class: ''};
    }
  }

  isEmpty(obj) {
    for(let prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }

  getBase() {
    return serverUrl;
  }
}
