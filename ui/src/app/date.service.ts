import { Injectable } from '@angular/core';
import {parseDate} from "ngx-bootstrap";

const weekDayNames: string[] =
  ["شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنج شنبه",
  "جمعه"];

const monthNames: string[] = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند"];

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() { }

  greToPersian(date, long: boolean = false): string{
    if(typeof (date) === "string"){
      date = new Date(Date.parse(date));
    }

    let pd = this.toPersian(date);
    if(long){
      return weekDayNames[(pd[3]+1)%7] + "، " +pd[0] + " " + monthNames[pd[1]-1] + " " + pd[2];
    }else {
      return pd[2] + "/" + pd[1] + "/" + pd[0];
    }
  }

  getMonthName(monthIndex: number): string{
    return monthNames[monthIndex];
  }

  getSholopDate(gregorianDate = new Date()): any{
    let perDate = this.toPersian(gregorianDate);

    let retVal = {
      gDate: gregorianDate,
      jDate:{
        date: perDate[0],
        month: perDate[1],
        year: perDate[2]
      }
    };

    return retVal;
  }

  toPersian(gregorianDate): number[] {

    let gregorianYear = gregorianDate.getFullYear();

    if ((gregorianYear % 4) != 0)
      return this.func1(gregorianDate);
    else
      return this.func2(gregorianDate);

  }

  func1(gregorianDate): number[] {

    let buf1 = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

    let gregorianYear = gregorianDate.getFullYear();
    let gregorianMonth = gregorianDate.getMonth() + 1;
    let gregorianDay = gregorianDate.getDate();
    let weekDay = gregorianDate.getDay();

    let month = 0;
    let year = 0;
    let day = buf1[gregorianMonth - 1] + gregorianDay;

    if (day > 79) {
      day = day - 79;
      if (day <= 186) {
        let day2 = day;
        month = (day2 / 31) + 1;
        day = (day2 % 31);
        if (day2 % 31 == 0) {
          month--;
          day = 31;
        }
        year = gregorianYear - 621;
      }
      else {
        let day2 = day - 186;
        month = (day2 / 30) + 7;
        day = (day2 % 30);
        if (day2 % 30 == 0) {
          month = (day2 / 30) + 6;
          day = 30;
        }
        year = gregorianYear - 621;
      }
    }
    else {
      let ld = gregorianYear > 1996 && gregorianYear % 4 == 1 ? 11 : 10;
      let day2 = day + ld;
      month = (day2 / 30) + 10;
      day = (day2 % 30);
      if (day2 % 30 == 0) {
        month--;
        day = 30;
      }
      year = gregorianYear - 622;
    }
    return [day, Math.floor(month), year, weekDay]
  }

  func2(gregorianDate): number[] {

    let buf2 = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

    let gregorianYear = gregorianDate.getFullYear();
    let gregorianMonth = gregorianDate.getMonth() + 1;
    let gregorianDay = gregorianDate.getDate();
    let weekDay = gregorianDate.getDay();

    let month = 0;
    let year = 0;
    let day = buf2[gregorianMonth - 1] + gregorianDay;

    let ld = gregorianYear >= 1996 ? 79 : 80;

    if (day > ld) {
      day = day - ld;
      if (day <= 186) {
        let day2 = day;
        month = (day2 / 31) + 1;
        day = (day2 % 31);
        if (day2 % 31 == 0) {
          month--;
          day = 31;
        }
        year = gregorianYear - 621;
      } else {
        let day2 = day - 186;
        month = (day2 / 30) + 7;
        day = (day2 % 30);
        if (day2 % 30 == 0) {
          month--;
          day = 30;
        }
        year = gregorianYear - 621;
      }
    }
    else {
      let day2 = day + 10;
      month = (day2 / 30) + 10;
      day = (day2 % 30);
      if (day2 % 30 == 0) {
        month--;
        day = 30;
      }
      year = gregorianYear - 622;
    }

    return [day, Math.floor(month), year, weekDay];
  }
}
