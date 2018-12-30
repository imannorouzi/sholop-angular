import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import {CreateEventComponent} from "./create-event/create-event.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {HomeComponent} from "./home/home.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {AuthGuard} from "./auth-guard.service";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {VenuesComponent} from "./venues/venues.component";
import {ContactUsComponent} from "./contact-us/contact-us.component";
import {ProfileComponent} from "./profile/profile.component";
import {CreateMeetingComponent} from "./create-meeting/create-meeting.component";
import {EditMeetingComponent} from "./edit-meeting/edit-meeting.component";
import {UserMeetingComponent} from "./user-meeting/user-meeting.component";
import {ContactMeetingComponent} from "./contact-meeting/contact-meeting.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'create-event', component: CreateEventComponent },
  { path: 'create-meeting', component: CreateMeetingComponent, canActivate: [AuthGuard] },
  { path: 'edit-meeting/:id', component: EditMeetingComponent, canActivate: [AuthGuard] },
  { path: 'meeting/:id', component: UserMeetingComponent, canActivate: [AuthGuard] },
  { path: 'contact-meeting/:uuid/:dateId/:action', component: ContactMeetingComponent},
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard] },
  { path: 'venues', component: VenuesComponent, canActivate: [AuthGuard] },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
