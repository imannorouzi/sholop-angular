import {Injectable, OnDestroy, OnInit} from '@angular/core';

@Injectable()
export class GlobalDataService implements OnInit, OnDestroy{
  //cachedData: Observable<any>;

  private cleanUpKeys = new Set();
  private realTimeKeys = new Set();
  private data: any = {};

  cleanUp(){

    this.cleanUpKeys.forEach( (k:string) => {
      this.deleteData(k);
    });

    this.cleanUpKeys.clear();
  }

  getData(key: string = undefined) {
    if (!key){
      // return it all
      return this.data;
    }
    return this.data[key];
  }

  hasData(key: string) {
    return key in this.data;
  }

  deleteData(key: string) {
    if (key in this.data) {
      delete this.data[key];
    }
  }

  /*
  * key is the key!
  * obj is what should be saved
  * cleanUp is used for temporary saved data, like filters in edit fault page which should be cleared after coming to main page
  * realtime is for the data which get obsoleted after some time, so they shouldn't be stored in storage session
  **/
  putData(key: string, obj: any, cleanUp: boolean = false, realTime = false) {
    // The key is component name
    if (key){

      if(cleanUp){
        this.cleanUpKeys.add(key);
      }

      if(realTime){
        this.realTimeKeys.add(key);
      }

      // Should update the object based on the inner objects coz
      // different elements are coming from different sources
      // means we could have ( {k1: v1}, component ) and ( {k2, v2), component )
      // which both k1, k2 should be stored for component

      if (this.data[key]){
        for (let k in obj) {
          if (obj.hasOwnProperty(k)) {
            this.data[key][k] = obj[k];
          }
        }
      }
      else {
        this.data[key] = obj;
      }
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  reset(userId = 'ro'):void{
    this.data = {};
    this.cleanUpKeys = new Set();
    this.realTimeKeys = new Set();

    // Maybe not needed
    this.saveToLocalStorage(userId);
  }

  public saveToLocalStorage(userId = 'ro') {

      this.realTimeKeys.forEach( (k: string) => {
        this.deleteData(k);
      });

      if (this.data) {
        localStorage.setItem('global-data-' + userId, JSON.stringify(this.data));
      }
  }

  public loadFromLocalStorage(userId = 'ro') {
    let d = localStorage.getItem('global-data-' + userId);
    if (d) {
      this.data = JSON.parse(d);
    }
  }

  public saveToSessionStorage() {
    if (this.storageAvailable('sessionStorage')) {
      let sessionStorage = window['sessionStorage'];

      this.realTimeKeys.forEach( (k: string) => {
        this.deleteData(k);
      });

      if (!this.data) {
        sessionStorage.removeItem('global-data');
      }else {
        sessionStorage['global-data'] = JSON.stringify(this.data);
      }
    }
  }

  public loadFromSessionStorage() {
    if (this.storageAvailable('sessionStorage')) {
      let sessionStorage = window['sessionStorage'];

      if ('global-data' in sessionStorage) {
        this.data = JSON.parse(sessionStorage['global-data']);
      }
    }
  }

  private storageAvailable(type) {
    try {
      let storage = window[type],
          x = '__storage_test__';
      (<any>storage).setItem(x, x);
      (<any>storage).removeItem(x);
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
              // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          Storage.length !== 0;
    }
  }


}
