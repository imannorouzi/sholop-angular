import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateEventComponent } from './create-event/create-event.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { EventCardComponent } from './event-card/event-card.component';
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { DateComponent} from "./date/date.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ImageCropperComponent } from 'ng2-img-cropper';
import { ModalComponent } from "./ng-modal/modal.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ContactsModalComponent } from './contacts-modal/contacts-modal.component';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {ErrorInterceptor} from "./error-interceptor.service";
import {JwtInterceptor} from "./jwt-interceptor.service";
import {UserService} from "./user.service";
import {AuthenticationService} from "./authentication.service";
import {AlertService} from "./alert.service";
import {AuthGuard} from "./auth-guard.service";

@NgModule({
  declarations: [
    AppComponent,
    CreateEventComponent,
    DashboardComponent,
    NavbarComponent,
    HomeComponent,
    EventCardComponent,
    DateComponent,
    ImageCropperComponent,
    ModalComponent,
    CreateMeetingComponent,
    ContactsComponent,
    AddContactComponent,
    ContactsModalComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
  ],
  providers: [
    HttpClientModule,
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
