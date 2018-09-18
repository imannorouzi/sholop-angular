export class Venue {
  id: number = -1;
  title : string = '';
  lat : number;
  lng : number;
  address1: string = '';
  address2: string = '';
  mapUrl: string = '';

  constructor(
    id: number,
    title: string,
    lat: number,
    lng: number,
    address1: string = '',
    address2: string = '',
    mapUrl: string = ''){

    this.id = id;
    this.title = title;
    this.lat = lat;
    this.lng = lng;
    this.address1 = address1;
    this.address2 = address2;
    this.mapUrl = mapUrl;
  }
}
