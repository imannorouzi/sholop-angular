import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import {first} from "rxjs/operators";
import {AuthenticationService} from "../authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../alert.service";

@Injectable()
export class AfService {
  user: Observable<firebase.User>;
  constructor(public afAuth: AngularFireAuth,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private alertService: AlertService)
  {
    this.user = afAuth.authState;

    this.user.subscribe(
      u => {
        console.log(u);

        if(!this.user || !u) return;

        let user = {
          name: u.displayName,
          username: u.email,
          email: u.email,
          uid: u.uid,
          imageUrl: u.photoURL,
          phone: u.phoneNumber
        };

        this.authenticationService.loginWithGoogle(user)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate([ this.route.snapshot.queryParams['returnUrl'] || '/dashboard']);

              this.logout();
            },
            error => {
              this.alertService.error(error);
            });

      }, error => {
        console.log(error);
      }
    )
  }

  loginWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider);
  }

  logout(){
    this.afAuth.auth.signOut();
  }
}
