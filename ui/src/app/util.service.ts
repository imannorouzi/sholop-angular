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
        return 'جواب نداده';
      case 'ATTENDING':
        return 'می آم';
      case 'NOT_ATTENDING':
        return 'نمیام';

      default:
        return 'نامشخص';
    }
  }
}
