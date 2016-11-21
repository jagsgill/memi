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
var OutputDetectiveChart = (function () {
    function OutputDetectiveChart(canvas) {
        this.canvas = canvas;
    }
    OutputDetectiveChart.prototype.render = function (result) {
        // [ {fname: ... , fsize: ..., type: ...}] <= result.entries
        // { totalsize: ..., cwd: ....} <= result.summary
        var entries = result.entries;
        var summary = result.summary;
        var root = {
            cwd: summary.cwd,
            children: entries
        };
        var svg = d3.select(this.canvas), diameter = +svg.attr("width"), g = svg.append("g").attr("transform", "translate(2,2)"), format = d3.format(",d");
        var pack = d3.pack()
            .size([diameter - 4, diameter - 4]);
        root = d3.hierarchy(root)
            .sum(function (d) { return d.fsize; })
            .sort(function (a, b) { return b.value - a.value; });
        var node = g.selectAll(".node")
            .data(pack(root).descendants())
            .enter().append("g")
            .attr("class", function (d) { return d.children ? "node" : "leaf node"; })
            .attr("transform", function (d) { return "translate( " + d.x + ", " + d.y + ")"; });
        node.append("title")
            .text(function (d) { return d.data.fname + "\n" + format(d.value); });
        node.append("circle")
            .attr("r", function (d) { return d.r; });
        node.filter(function (d) { return !d.children; })
            .append("text")
            .attr("dy", "0.3em")
            .text(function (d) { return d.data.fname.substring(0, d.r / 3); });
    };
    return OutputDetectiveChart;
}());
OutputDetectiveChart = __decorate([
    core_1.Component({
        // encapsulation: ViewEncapsulation.None,
        selector: "detective-chart",
        template: "",
        styleUrls: [
            "output-detective-chart.style.css"
        ]
    }),
    __metadata("design:paramtypes", [HTMLElement])
], OutputDetectiveChart);
exports.OutputDetectiveChart = OutputDetectiveChart;
//# sourceMappingURL=output-detective-chart.component.js.map