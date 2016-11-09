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
var disk_query_service_1 = require("./disk-query.service");
var PathInputComponent = (function () {
    // TODO path completion
    function PathInputComponent(diskQueryService) {
        this.diskQueryService = diskQueryService;
        this.path = "";
    }
    PathInputComponent.prototype.analyze = function () {
        // TODO replace console.log with dev logging
        console.log("Analyzing path: " + this.path);
        this.diskQueryService.diskUsage(this.path);
    };
    return PathInputComponent;
}());
PathInputComponent = __decorate([
    core_1.Component({
        selector: 'path-input',
        templateUrl: 'path-input.component.html',
        styleUrls: [
            'path-input.style.css'
        ]
    }),
    __metadata("design:paramtypes", [disk_query_service_1.DiskQueryService])
], PathInputComponent);
exports.PathInputComponent = PathInputComponent;
//# sourceMappingURL=path-input.component.js.map