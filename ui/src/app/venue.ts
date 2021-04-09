export const TEHRAN = {lat: 35.6892, lng: 51.3890}

export class Venue {
  id: number = -1;
  title : string = '';
  latitude : number;
  longitude : number;
  farsiAddress1: string = '';
  farsiAddress2: string = '';
  mapUrl: string = '';
  description: string = '';
  link: string = '';
  virtual: boolean = false;


  constructor(
    id: number = 0,
    title: string = '',
    lat: number = TEHRAN.lat,
    lng: number = TEHRAN.lng,
    address1: string = '',
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
