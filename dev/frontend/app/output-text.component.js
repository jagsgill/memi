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
var OutputTextComponent = (function () {
    function OutputTextComponent(diskQueryService, changeDetectorRef) {
        this.diskQueryService = diskQueryService;
        this.changeDetectorRef = changeDetectorRef;
    }
    OutputTextComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.diskQueryService.diskQueryFinishedEvent.subscribe(function (result) { return _this.diskQueryFinishedHandler(result); });
    };
    OutputTextComponent.prototype.diskQueryFinishedHandler = function (result) {
        // TODO could be done using Observables?
        // View is not re-rendered until some UI action takes place
        // Possibly non-futureproof solution at http://stackoverflow.com/questions/34827334/triggering-angular2-change-detection-manually
        this.entries = result.entries;
        this.summary = result.summary;
        this.changeDetectorRef.detectChanges();
    };
    return OutputTextComponent;
}());
OutputTextComponent = __decorate([
    core_1.Component({
        selector: "output-text",
        templateUrl: "output-text.component.html",
        styleUrls: [
            'output-text.style.css'
        ]
    }),
    __metadata("design:paramtypes", [disk_query_service_1.DiskQueryService,
        core_1.ChangeDetectorRef])
], OutputTextComponent);
exports.OutputTextComponent = OutputTextComponent;
//# sourceMappingURL=output-text.component.js.map