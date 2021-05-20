// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  VERSION: require('../../package.json').version,
  firebase:
    {
      apiKey: 'AIzaSyDPxrXEXL44MTWY5ZOhm55Z9EucFkS0Rg0',
      authDomain: 'sholop-1526521509022.firebaseapp.com',
      databaseURL: 'https://sholop-1526521509022.firebaseio.com',
      projectId: 'sholop-1526521509022',
      storageBucket: 'sholop-1526521509022.appspot.com',
      messagingSenderId: '635253433511'
    },
  baseUrl: '',
  serverUrl: '/api',
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
