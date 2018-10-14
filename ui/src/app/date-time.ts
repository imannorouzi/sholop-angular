import {Calendar} from "./calendar";

export class DateTime {
  from : string = '';
  to : string = '';

  date : Calendar = new Calendar();

  setDate(date){
    this.date = date;
  }
}
