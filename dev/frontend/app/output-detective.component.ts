import { Component, Input, ViewChild, OnChanges, AfterViewInit } from "@angular/core";

import { OutputDetectiveChart } from "./output-detective.chart";

@Component({
  selector: "output-detective",
  template: "<svg #canvas width='400' height='400'></svg>"
})

export class OutputDetectiveComponent implements OnChanges, AfterViewInit {
  @Input() files: any[];
  @ViewChild("canvas") canvas: any; // reference to svg canvas child node for the view
  chart: OutputDetectiveChart;

  constructor() {}

  ngOnChanges(changes: any): void {
    if (this.chart) {
      this.chart.render(changes.values);
    }
  }

  ngAfterViewInit(): void {
  this.chart = new OutputDetectiveChart(this.canvas.nativeElement);
  this.chart.render(this.files);
  }
}
