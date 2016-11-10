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
var menu_bar_main_component_1 = require("./menu-bar-main.component");
var path_input_component_1 = require("./path-input.component");
var output_text_component_1 = require("./output-text.component");
var output_detective_component_1 = require("./output-detective.component");
var disk_query_service_1 = require("./disk-query.service");
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
        ],
        declarations: [
            home_component_1.HomeComponent,
            menu_bar_main_component_1.MenuBarMainComponent,
            path_input_component_1.PathInputComponent,
            output_text_component_1.OutputTextComponent,
            output_detective_component_1.OutputDetectiveComponent
        ],
        providers: [
            disk_query_service_1.DiskQueryService
        ],
        bootstrap: [home_component_1.HomeComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map