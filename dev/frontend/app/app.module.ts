import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';

import { HomeComponent } from './home.component'
import { MenuBarMainComponent } from './menu-bar-main.component'


@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    HomeComponent,
    MenuBarMainComponent
  ],
  bootstrap: [ ]
})

export class AppModule { }
