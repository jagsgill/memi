"use strict";
var d3 = require("d3");
var OutputDetectiveChart = (function () {
    function OutputDetectiveChart(canvas) {
        this.canvas = canvas;
    }
    OutputDetectiveChart.prototype.render = function (files) {
        var circleData = [
            { "cx": 20, "cy": 20, "radius": 20, "color": "green" },
            { "cx": 70, "cy": 70, "radius": 20, "color": "purple" }
        ];
        var text = d3.select(this.canvas)
            .selectAll("text")
            .data(circleData)
            .enter()
            .append("text");
        var textLabels = text
            .attr("x", function (d) { return d.cx; })
            .attr("y", function (d) { return d.cy; })
            .text(function (d) { return "( " + d.cx + ", " + d.cy + " )"; })
            .attr("font-family", "sans-serif")
            .attr("font-size", "20px")
            .attr("fill", "red");
    };
    return OutputDetectiveChart;
}());
exports.OutputDetectiveChart = OutputDetectiveChart;
//# sourceMappingURL=output-detective.chart.js.map