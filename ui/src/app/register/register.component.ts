import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {AlertService} from "../alert.service";
import {UserService} from "../user.service";
import {AfService} from "../providers/af.service";

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private afService: AfService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      type: ['PERSONAL', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data && data['msg'] === "OK" && data['object'].token) {

            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.alertService.success('ثبت نام شما با موفقیت انجام شد.', true);
            localStorage.setItem('currentUser', JSON.stringify(data['object']));
            this.router.navigate(['/dashboard']);

          }else if(data['msg'] === 'DUPLICATE'){
            this.alertService.error('این ایمیل قبلا ثبت نام کرده است.', true);
          }else{
            this.alertService.error('مشکلی به وجود آمد. لطفا دوباره تلاش کنید.', true);
          }
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }


  loginWithGoogle(){
    this.afService.logout();
    this.afService.loginWithGoogle(this.registerForm.value.type);
  }
}
