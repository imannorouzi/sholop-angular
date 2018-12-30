import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  convertTimeString(timeString){
    return timeString.substring(0, 2) + ":" + timeString.substring(2);
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
        return {text:  'شاید', color: 'yellow', class: 'fa-exclamation'};

      default:
        return {text:  'نامشخص', color: 'gray', class: ''};
    }
  }

  getRandomColor(){
    let colors = ['red', 'green', 'blue', 'orange', 'yellow'];

    return colors[Math.floor(Math.random() * colors.length)];
  }
}
