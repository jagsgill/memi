import { Component, ViewEncapsulation } from "@angular/core";
import * as d3 from "d3";

import { DiskQueryResult } from "./disk-query.service";

@Component({
  // encapsulation: ViewEncapsulation.None,
  selector: "detective-chart",
  template: "",
  styleUrls: [
    "output-detective-chart.style.css"
  ]
})

export class OutputDetectiveChart {

    canvas: HTMLElement;

    constructor(canvas: HTMLElement) {
        this.canvas = canvas;
    }

    render(result: DiskQueryResult): void {

        // [ {fname: ... , fsize: ..., type: ...}] <= result.entries
        // { totalsize: ..., cwd: ....} <= result.summary

        let entries = result.entries;
        let summary = result.summary;
        let root: any = {
          cwd: summary.cwd,
          children: entries
        };

        let svg = d3.select(this.canvas),
        diameter = +svg.attr("width"),
        g = svg.append("g").attr("transform", "translate(2,2)"),
        format = d3.format(",d");

        let pack = d3.pack()
        .size([diameter - 4, diameter - 4]);

        root = d3.hierarchy(root)
        .sum(function(d) { return d.fsize; })
        .sort(function (a, b) { return b.value - a.value; });

        let node = g.selectAll(".node")
        .data(pack(root).descendants())
        .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return `translate( ${d.x}, ${d.y})`; });

        node.append("title")
        .text(function(d: any) { return d.data.fname + "\n" + format(d.value); });

        node.append("circle")
        .attr("r", function(d) { return d.r; });

        node.filter(function(d) { return !d.children; })
        .append("text")
        .attr("dy", "0.3em")
        .text(function(d: any) { return d.data.fname.substring(0, d.r / 3); });

    }
}
