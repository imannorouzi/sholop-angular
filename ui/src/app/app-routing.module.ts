import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import {CreateEventComponent} from "./create-event/create-event.component";
import {MeetingsComponent} from "./meetings/meetings.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {AuthGuard} from "./utils/auth-guard.service";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {VenuesComponent} from "./venues/venues.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {ProfileComponent} from "./profile/profile.component";
import {CreateMeetingComponent} from "./create-meeting/create-meeting.component";
import {EditMeetingComponent} from "./edit-meeting/edit-meeting.component";
import {UserMeetingComponent} from "./user-meeting/user-meeting.component";
import {ContactMeetingComponent} from "./contact-meeting/contact-meeting.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {ConditionsComponent} from "./conditions/conditions.component";
import {FaqComponent} from "./faq/faq.component";
import {CreateTokenComponent} from "./create-token/create-token.component";
import {TokensComponent} from "./tokens/tokens.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {EmployeeComponent} from "./employees/employee.component";
import {AddressBookComponent} from "./address-book/address-book.component";
import {ContactEventMeetingComponent} from "./contact-event-meeting/contact-event-meeting.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'create-meeting', component: CreateMeetingComponent, canActivate: [AuthGuard] },
  { path: 'create-token', component: CreateTokenComponent, canActivate: [AuthGuard] },
  { path: 'edit-meeting/:id', component: EditMeetingComponent, canActivate: [AuthGuard] },
  { path: 'meeting/:id', component: UserMeetingComponent, canActivate: [AuthGuard] },
  { path: 'contact-meeting/:uuid/:dateId/:action', component: ContactMeetingComponent},
  { path: 'meetings', component: MeetingsComponent, canActivate: [AuthGuard] },
  { path: 'home', component: MeetingsComponent, canActivate: [AuthGuard] },
  { path: 'tokens', component: TokensComponent, canActivate: [AuthGuard] },
  { path: 'address-book', component: AddressBookComponent, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeeComponent, canActivate: [AuthGuard] },
  { path: 'employees/:role', component: EmployeeComponent, canActivate: [AuthGuard] },
  { path: 'venues', component: VenuesComponent, canActivate: [AuthGuard] },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'settings', component: ProfileComponent },
  { path: 'conditions', component: ConditionsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'my-meeting/:uuid', component: ContactEventMeetingComponent},

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // otherwise redirect to "Not Found!"
  { path: '**', component: PageNotFoundComponent  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  declarations: [],
  exports: [
    RouterModule
  ],
  providers: [ AuthGuard ]
})
export class AppRoutingModule { }
