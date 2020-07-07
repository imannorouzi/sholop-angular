export class Venue {
  id: number = -1;
  title : string = '';
  latitude : number;
  longitude : number;
  farsiAddress1: string = '';
  farsiAddress2: string = '';
  mapUrl: string = '';


  constructor(
    id: number = 0,
    title: string = '',
    lat: number = 18.5793,
    lng: number = 73.8143,
    address1: string = 'تهران، در دوم، کدپستی ۲',
    address2: string = '',
    mapUrl: string = ''){

    this.id = id;
    this.title = title;
    this.latitude = lat;
    this.longitude = lng;
    this.farsiAddress1 = address1;
    this.farsiAddress2 = address2;
    this.mapUrl = mapUrl;
  }
}
