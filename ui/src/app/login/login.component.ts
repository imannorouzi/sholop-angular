import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfService } from '../providers/af.service';


import {AlertService} from '../alert.service';
import {SpinnerService} from '../utils/spinner.service';
import { of} from 'rxjs';
import {AuthService} from '../utils/auth.service';
import {LocalStorageService} from '../utils/local-storage.service';
import {DummyData} from '../dummyData';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public afService: AfService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authService.logout();
    if (this.afService.user) {
      this.afService.logout();
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/meetings';

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(isGuest = false) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid && !isGuest) {
      return;
    }

    this.loading = true;
    (isGuest ?
      of(DummyData.USER)
      :
      this.authService.loginWithServer(this.f.username.value, this.f.password.value))
      .subscribe(
        user => {
          if (user) {
            if (this.localStorageService.checkIn(user.id)) {
              this.authService.login(user);
              this.router.navigate([this.authService.redirectUrl]);

              this.authService.loggedIn.next();
            }
          }
          this.loading = false;
        }, error => {
          this.loading = false;
          console.error(error);
          this.alertService.error('مشکلی پیش آمد.');
        });
  }

  loginWithGoogle() {
    this.afService.logout();
    this.afService.loginWithGoogle('PERSONAL');
  }

}
