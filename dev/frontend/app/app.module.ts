import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { HomeComponent } from './home.component'
import { MenuBarMainComponent } from './menu-bar-main.component'
import { PathInputComponent } from './path-input.component'

import { DiskQueryService } from './disk-query.service'


@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    HomeComponent,
    MenuBarMainComponent,
    PathInputComponent
  ],
  providers: [
    DiskQueryService
  ],
  bootstrap: [ HomeComponent ]
})

export class AppModule { }
