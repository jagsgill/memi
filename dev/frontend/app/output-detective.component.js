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
var output_detective_chart_1 = require("./output-detective.chart");
var OutputDetectiveComponent = (function () {
    function OutputDetectiveComponent() {
    }
    OutputDetectiveComponent.prototype.ngOnChanges = function (changes) {
        if (this.chart) {
            this.chart.render(changes.values);
        }
    };
    OutputDetectiveComponent.prototype.ngAfterViewInit = function () {
        this.chart = new output_detective_chart_1.OutputDetectiveChart(this.canvas.nativeElement);
        this.chart.render(this.files);
    };
    return OutputDetectiveComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], OutputDetectiveComponent.prototype, "files", void 0);
__decorate([
    core_1.ViewChild('canvas'),
    __metadata("design:type", Object)
], OutputDetectiveComponent.prototype, "canvas", void 0);
OutputDetectiveComponent = __decorate([
    core_1.Component({
        selector: 'output-detective',
        template: '<svg #canvas width="400" height="400"></svg>'
    }),
    __metadata("design:paramtypes", [])
], OutputDetectiveComponent);
exports.OutputDetectiveComponent = OutputDetectiveComponent;
//# sourceMappingURL=output-detective.component.js.map