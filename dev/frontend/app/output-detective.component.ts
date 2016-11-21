import { Component, Input, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
import * as d3 from "d3";

import { DiskQueryService, DiskQueryResult } from "./disk-query.service";
import { OutputDetectiveChart } from "./output-detective-chart.component";
const STATUS = require("../../util/errorcodes.js").STATUS;

@Component({
    encapsulation: ViewEncapsulation.None, // style encapsulation breaks styling of SVG node's children
    selector: "output-detective",
    templateUrl: "output-detective.component.html",
    styleUrls: [
        "output-detective.style.css",
    ]
})

export class OutputDetectiveComponent {
    @Input() files: any[];
    @ViewChild("canvas") canvas: any; // reference to svg canvas child node for the view

    dirExists = false;
    querySubmitted = false;
    entries: any[] = [];
    summary: {};

    constructor(private diskQueryService: DiskQueryService) { }

    ngOnInit(): void {
        this.diskQueryService.diskQueryFinishedEvent.subscribe(
            (result: DiskQueryResult) => this.diskQueryFinishedHandler(result)
        );
    }

    diskQueryFinishedHandler(result: DiskQueryResult): void {
        this.querySubmitted = true;
        this.summary = result.summary; // for displaying <dir> not found msg
        if (result.status === STATUS.OK) {
            this.dirExists = true;
            this.render(result);
        } else if (result.status === STATUS.DIR_NOT_EXIST) {
            this.dirExists = false;
        }
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

        let svg = d3.select(this.canvas.nativeElement);
        svg.selectAll("*").remove();

        let diameter = +svg.attr("width"),
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
