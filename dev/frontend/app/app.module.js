"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var home_component_1 = require("./home.component");
var home_content_component_1 = require("./home-content.component");
var menu_bar_main_component_1 = require("./menu-bar-main.component");
var path_input_component_1 = require("./path-input.component");
var output_text_component_1 = require("./output-text.component");
var output_detective_component_1 = require("./output-detective.component");
var join_paths_pipe_1 = require("./join-paths.pipe");
var disk_usage_for_path_service_1 = require("./disk-usage-for-path.service");
var list_contents_for_path_service_1 = require("./list-contents-for-path.service");
var app_routes_1 = require("./app.routes");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            app_routes_1.routing
        ],
        declarations: [
            home_component_1.HomeComponent,
            home_content_component_1.HomeContentComponent,
            menu_bar_main_component_1.MenuBarMainComponent,
            path_input_component_1.PathInputComponent,
            output_text_component_1.OutputTextComponent,
            output_detective_component_1.OutputDetectiveComponent,
            join_paths_pipe_1.JoinPathsPipe
        ],
        providers: [
            disk_usage_for_path_service_1.DiskUsageService,
            list_contents_for_path_service_1.ListDirService
        ],
        bootstrap: [home_component_1.HomeComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map