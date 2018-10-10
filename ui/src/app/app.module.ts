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
import {HttpClientModule} from "@angular/common/http";
import { ImageCropperComponent } from 'ng2-img-cropper';
import { ModalComponent } from "./ng-modal/modal.component";

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
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    AngularFontAwesomeModule,
    HttpClientModule,
  ],
  exports: [
  ],
  providers: [
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
