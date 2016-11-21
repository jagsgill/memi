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
var output_detective_chart_1 = require("./output-detective.chart");
var STATUS = require("../../util/errorcodes.js").STATUS;
var OutputDetectiveComponent = (function () {
    function OutputDetectiveComponent(diskQueryService) {
        this.diskQueryService = diskQueryService;
        this.dirExists = false;
        this.querySubmitted = false;
        this.entries = [];
    }
    OutputDetectiveComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.diskQueryService.diskQueryFinishedEvent.subscribe(function (result) { return _this.diskQueryFinishedHandler(result); });
    };
    OutputDetectiveComponent.prototype.ngAfterViewInit = function () {
        this.chart = new output_detective_chart_1.OutputDetectiveChart(this.canvas.nativeElement);
    };
    OutputDetectiveComponent.prototype.diskQueryFinishedHandler = function (result) {
        this.querySubmitted = true;
        this.entries = result.entries;
        this.summary = result.summary;
        if (result.status === STATUS.OK) {
            this.dirExists = true;
            this.chart.render(result);
        }
        else if (result.status === STATUS.DIR_NOT_EXIST) {
            this.dirExists = false;
        }
    };
    return OutputDetectiveComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], OutputDetectiveComponent.prototype, "files", void 0);
__decorate([
    core_1.ViewChild("canvas"),
    __metadata("design:type", Object)
], OutputDetectiveComponent.prototype, "canvas", void 0);
OutputDetectiveComponent = __decorate([
    core_1.Component({
        selector: "output-detective",
        templateUrl: "output-detective.component.html",
        styleUrls: [
            "output-detective.component.css"
        ]
    }),
    __metadata("design:paramtypes", [disk_query_service_1.DiskQueryService])
], OutputDetectiveComponent);
exports.OutputDetectiveComponent = OutputDetectiveComponent;
//# sourceMappingURL=output-detective.component.js.map