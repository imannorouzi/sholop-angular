import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateEventComponent } from './create-event/create-event.component';
import { MeetingsComponent } from './meetings/meetings.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { EventCardComponent } from './event-card/event-card.component';
import { DateComponent} from "./common-components/date/date.component";
import { HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ImageCropperModule } from 'ngx-image-cropper';
import { ModalComponent } from "./common-components/ng-modal/modal.component";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import { EditableMeetingComponent } from './editable-meeting/editable-meeting.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ContactsModalComponent } from './contacts-modal/contacts-modal.component';
import { AlertComponent } from './alert/alert.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptor} from "./error-interceptor.service";
import { JwtInterceptor} from "./jwt-interceptor.service";
import { UserService} from "./utils/user.service";
import { AlertService} from "./alert.service";
import { AuthGuard} from "./utils/auth-guard.service";
import { CalendarComponent } from './common-components/calendar/calendar.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AddAttendeeComponent} from "./add-attendee/add-attendee.component";
import { TimeComponent } from './common-components/time/time.component';
import {MeetingItemComponent} from "./meeting-item/meeting-item.component";
import {DateService} from "./utils/date.service";
import {MeetingItemModalComponent} from "./meeting-item-modal/meeting-item-modal.component";
import { CommentsComponent } from './comments/comments.component';
import { SuggestingItemInputComponent } from './suggesting-item-input/suggesting-item-input.component';
import {AgmCoreModule} from "@agm/core";
import { VenuesModalComponent } from './venues-modal/venues-modal.component';
import { VenuesComponent } from './venues/venues.component';
import {environment} from "../environments/environment.prod";


import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule} from 'angularfire2/database';
import {AfService} from "./providers/af.service";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FooterComponent } from './footer/footer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProfileComponent } from './profile/profile.component';
import { MeetingComponent } from './meeting/meeting.component';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { EditMeetingComponent } from './edit-meeting/edit-meeting.component';
import { ConfirmComponent } from './common-components/confirm/confirm.component';
import { ContactMeetingComponent } from './contact-meeting/contact-meeting.component';
import { UserMeetingComponent } from './user-meeting/user-meeting.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FaqComponent } from './faq/faq.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { AboutUsComponent } from './about-us/about-us.component';
import {AddVenueComponent} from "./add-venue/add-venue.component";
import { IconedInputComponent } from './common-components/iconed-input/iconed-input.component';
import { SwitchButtonComponent } from './common-components/switch-button/switch-button.component';
import {ClickOutsideDirective} from "./utils/click-outside.directive";
import {AuthService} from "./utils/auth.service";
import {LocalStorageService} from "./utils/local-storage.service";
import {GlobalDataService} from "./utils/global-data.service";
import {CreateTokenComponent} from "./create-token/create-token.component";
import {TokensComponent} from "./tokens/tokens.component";
import {TokenItemComponent} from "./token-item/token-item.component";
import {TokenItemModalComponent} from "./token-item-modal/token-item-modal.component";
import {ReceptionItemModalComponent} from "./reception-item-modal/reception-item-modal.component";
import {ReceptionComponent} from "./reception/reception.component";
import {ReceptionService} from "./reception/reception.service";
import { SlidingTextComponent } from './sliding-text/sliding-text.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { OwlComponent } from './owl/owl.component';
import {AddEmployeeComponent} from "./add-employee/add-employee.component";
import {EmployeeComponent} from "./employees/employee.component";
import {GuestListComponent} from "./contacts-modal/guest-list/guest-list.component";
import {GeneralPipe, KeysPipe} from "./utils/general-pipe";
import { AddressBookComponent } from './address-book/address-book.component';
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import {OverlaySpinnerComponent} from "./common-components/overlay-spinner/overlay.spinner.component";
import {ContentModalComponent} from "./common-components/content-modal/content-modal.component";
import {ModalModule} from "ngx-bootstrap/modal";
import { MeetingDetailsComponent } from './meeting-details/meeting-details.component';
import { ContactEventMeetingComponent } from './contact-event-meeting/contact-event-meeting.component';
import { ProfileNavbarComponent } from './profile-navbar/profile-navbar.component';
import { FloatingButtonComponent } from './floating-button/floating-button.component';
import { MapComponent } from './map/map.component';
import { GuestsComponent } from './guests/guests.component';
import { SelectVenueComponent } from './select-venue/select-venue.component';
import { VirtualVenueComponent } from './virtual-venue/virtual-venue.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateEventComponent,
    MeetingsComponent,
    NavbarComponent,
    HomeComponent,
    EventCardComponent,
    DateComponent,
    // ImageCropperComponent,
    ModalComponent,
    EditableMeetingComponent,
    ContactsComponent,
    AddContactComponent,
    ContactsModalComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    CalendarComponent,
    SpinnerComponent,
    AddAttendeeComponent,
    ClickOutsideDirective,
    TimeComponent,
    MeetingItemComponent,
    MeetingItemModalComponent,
    CommentsComponent,
    SuggestingItemInputComponent,
    VenuesModalComponent,
    VenuesComponent,
    FooterComponent,
    ContactUsComponent,
    ProfileComponent,
    MeetingComponent,
    CreateMeetingComponent,
    EditMeetingComponent,
    ConfirmComponent,
    ContactMeetingComponent,
    UserMeetingComponent,
    PageNotFoundComponent,
    FaqComponent,
    ConditionsComponent,
    AboutUsComponent,
    AddVenueComponent,
    IconedInputComponent,
    SwitchButtonComponent,
    CreateTokenComponent,
    TokensComponent,
    TokenItemComponent,
    TokenItemModalComponent,
    ReceptionItemModalComponent,
    ReceptionComponent,
    SlidingTextComponent,
    LandingPageComponent,
    OwlComponent,
    AddEmployeeComponent,
    EmployeeComponent,
    GuestListComponent,
    GeneralPipe,
    KeysPipe,
    AddressBookComponent,
    QrCodeScannerComponent,
    OverlaySpinnerComponent,
    ContentModalComponent,
    MeetingDetailsComponent,
    ContactEventMeetingComponent,
    ProfileNavbarComponent,
    FloatingButtonComponent,
    MapComponent,
    GuestsComponent,
    SelectVenueComponent,
    VirtualVenueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDXNa76E7XTVYsZR5Q0qeOpE9LyFanBnGc",
      libraries: ["places"]
    }),
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ZXingScannerModule,
    ModalModule.forRoot()
  ],
  exports: [
  ],
  providers: [
    AfService,
    HttpClientModule,
    AuthGuard,
    AlertService,
    UserService,
    DateService,
    AuthService,
    LocalStorageService,
    GlobalDataService,
    ReceptionService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
