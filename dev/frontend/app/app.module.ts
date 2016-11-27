import { NgModule } from "@angular/core";
import { BrowserModule }  from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { HomeComponent } from "./home.component";
import { HomeContentComponent } from "./home-content.component";
import { MenuBarMainComponent } from "./menu-bar-main.component";
import { PathInputComponent } from "./path-input.component";
import { OutputTextComponent } from "./output-text.component";
import { OutputDetectiveComponent } from "./output-detective.component";

import { DiskUsageService, DiskUsageResult } from "./disk-usage-for-path.service";
import { ListDirService } from "./list-contents-for-path.service";
import { routing } from "./app.routes";


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing
  ],
  declarations: [
    HomeComponent,
    HomeContentComponent,
    MenuBarMainComponent,
    PathInputComponent,
    OutputTextComponent,
    OutputDetectiveComponent,
  ],
  providers: [
    DiskUsageService,
    ListDirService
  ],
  bootstrap: [ HomeComponent ]
})

export class AppModule { }
