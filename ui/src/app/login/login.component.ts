import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AfService } from '../providers/af.service';


import {AlertService} from "../alert.service";
import {AuthenticationService} from "../authentication.service";
import {SpinnerService} from "../spinner.service";

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    public AfService: AfService,
    private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();
    if(this.AfService.user) {
      this.AfService.logout();
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          if(data){
            this.router.navigate([this.returnUrl]);
          }
          this.loading = false;
        },
        error => {
          this.alertService.error("مشکلی پیش آمده. دوباره تلاش کنید.");
          this.loading = false;
        });
  }

  loginWithGoogle(){
    this.AfService.logout();
    this.AfService.loginWithGoogle();
  }

}
