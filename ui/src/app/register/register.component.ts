import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {AlertService} from "../alert.service";
import {UserService} from "../utils/user.service";
import {AfService} from "../providers/af.service";
import {NavigationService} from "../utils/navigation.service";
import {AuthService} from "../utils/auth.service";
import {LocalStorageService} from "../utils/local-storage.service";

@Component({templateUrl: 'register.component.html',
  styleUrls: ['register.component.css']})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private navigationService: NavigationService,
    private authService: AuthService,
    private afService: AfService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {

    // reset login status
    this.authService.logout();
    if(this.afService.user) {
      this.afService.logout();
    }

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

    this.authService.register(this.registerForm.value)
      .subscribe(
        user => {
          if(user){
            if(this.localStorageService.checkIn(user.id)) {
              this.authService.login(user);
              this.router.navigate([this.authService.redirectUrl]);

              this.authService.loggedIn.next();
            }
          }
          this.loading = false;
        });
  }


  loginWithGoogle(){
    this.afService.logout();
    this.afService.loginWithGoogle(this.registerForm.value.type);
  }
}
