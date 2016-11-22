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
var d3 = require("d3");
var disk_query_service_1 = require("./disk-query.service");
var STATUS = require("../../util/errorcodes.js").STATUS;
var iconFile = require("./icons/ic_event_note_black_18px.svg");
var iconDir = require("./icons/ic_folder_black_18px.svg");
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
    OutputDetectiveComponent.prototype.diskQueryFinishedHandler = function (result) {
        this.querySubmitted = true;
        this.summary = result.summary; // for displaying <dir> not found msg
        if (result.status === STATUS.OK) {
            this.dirExists = true;
            this.render(result);
        }
        else if (result.status === STATUS.DIR_NOT_EXIST) {
            this.dirExists = false;
        }
    };
    OutputDetectiveComponent.prototype.render = function (result) {
        // [ {fname: ... , fsize: ..., type: ...}] <= result.entries
        // { totalsize: ..., cwd: ....} <= result.summary
        var diskQueryService = this.diskQueryService;
        var entries = result.entries;
        var summary = result.summary;
        var root = {
            cwd: summary.cwd,
            children: entries
        };
        var svg = d3.select(this.canvas.nativeElement);
        svg.selectAll("*").remove();
        var diameter = +svg.attr("width"), g = svg.append("g").attr("transform", "translate(2,2)"), format = d3.format(",d");
        var pack = d3.pack()
            .size([diameter - 4, diameter - 4]);
        root = d3.hierarchy(root)
            .sum(function (d) { return d.fsize; })
            .sort(function (a, b) { return b.value - a.value; });
        var node = g.selectAll(".node")
            .data(pack(root).descendants())
            .enter().append("g")
            .attr("class", function (d) { return d.children ? "internal node" : "leaf node"; })
            .attr("transform", function (d) { return "translate( " + d.x + ", " + d.y + ")"; })
            .on("click", function (d) {
            if (d.data.type === "directory") {
                var path = summary.cwd + "/" + d.data.fname;
                diskQueryService.diskUsage(path);
            }
        });
        node.append("title")
            .text(function (d) { return d.data.fname + "\n" + format(d.value); });
        node.append("circle")
            .attr("r", function (d) { return d.r; });
        node.filter(function (d) { return !d.children; })
            .append("text")
            .attr("dy", "0.3em")
            .text(function (d) { return d.data.fname.substring(0, d.r / 3); });
        node.filter(function (d) { return d.data.fsize > 10000; })
            .append("image")
            .attr("transform", "translate(-9, -24)")
            .attr("width", "18px")
            .attr("height", "18px")
            .attr("xlink:href", function (d) {
            if (d.data.type === "directory") {
                return iconDir;
            }
            else {
                return iconFile;
            }
        });
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
        encapsulation: core_1.ViewEncapsulation.None,
        selector: "output-detective",
        templateUrl: "output-detective.component.html",
        styleUrls: [
            "output-detective.style.css",
        ]
    }),
    __metadata("design:paramtypes", [disk_query_service_1.DiskQueryService])
], OutputDetectiveComponent);
exports.OutputDetectiveComponent = OutputDetectiveComponent;
//# sourceMappingURL=output-detective.component.js.map