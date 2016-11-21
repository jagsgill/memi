import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeContentComponent } from "./home-content.component";
import { OutputTextComponent } from "./output-text.component";
import { OutputDetectiveComponent } from "./output-detective.component";

// TODO fix refreshing. e.g. when showing list or detective views, does not work
export const routes: Routes = [
  { path: "", component: HomeContentComponent },
  { path: "list", component: OutputTextComponent },
  { path: "detective", component: OutputDetectiveComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
