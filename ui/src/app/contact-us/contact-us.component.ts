import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {DataService} from "../data.service";
import {AlertService} from "../alert.service";
import {ValueTransform} from "@angular/compiler-cli/src/transformers/metadata_cache";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {


  contactUsForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private dataService: DataService,
              private alertService: AlertService) { }

  ngOnInit() {

    this.contactUsForm = this.formBuilder.group({
      title: ['', [ Validators.minLength(5), Validators.required ]],
      email: ['', [ Validators.email, Validators.required ]],
      name: [''],
      message: ['', [ Validators.minLength(20), Validators.required ]]
    });

  }

  get f() { return this.contactUsForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.contactUsForm.invalid) {
      return;
    }

    this.loading = true;
    let message  = {
      name: this.f.name.value,
      email: this.f.email.value,
      title: this.f.title.value,
      message: this.f.message.value
    };

    this.dataService.contactUs(message)
      .pipe(first())
      .subscribe(
        data => {
          console.log("sent")
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
