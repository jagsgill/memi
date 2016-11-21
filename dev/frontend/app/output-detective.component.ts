import { Component, Input, Inject, ViewChild, AfterViewInit } from "@angular/core";

import { DiskQueryService } from "./disk-query.service";
import { OutputDetectiveChart } from "./output-detective.chart";
const STATUS = require("../../util/errorcodes.js").STATUS;

@Component({
    selector: "output-detective",
    templateUrl: "output-detective.component.html",
    styleUrls: [
        "output-detective.component.css"
    ]
})

export class OutputDetectiveComponent implements AfterViewInit {
    @Input() files: any[];
    @ViewChild("canvas") canvas: any; // reference to svg canvas child node for the view
    chart: OutputDetectiveChart;

    dirExists = false;
    querySubmitted = false;
    entries: any[] = [];
    summary: {};

    constructor(private diskQueryService: DiskQueryService) { }

    ngOnInit(): void {
        this.diskQueryService.diskQueryFinishedEvent.subscribe(
            (result: any) => this.diskQueryFinishedHandler(result)
        );
    }

    ngAfterViewInit(): void {
        this.chart = new OutputDetectiveChart(this.canvas.nativeElement);
    }

    diskQueryFinishedHandler(result: any): void {
        this.querySubmitted = true;
        this.entries = result.entries;
        this.summary = result.summary;

        if (result.status === STATUS.OK) {
            this.dirExists = true;
            this.chart.render(result);
        } else if (result.status === STATUS.DIR_NOT_EXIST) {
            this.dirExists = false;
        }
    }
}
