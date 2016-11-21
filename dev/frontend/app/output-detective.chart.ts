import * as d3 from "d3";

import { DiskQueryResult } from "./disk-query.service";

export class OutputDetectiveChart {

  canvas: HTMLElement;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
  }

  render(result: DiskQueryResult): void {
      let entries = result.entries;
      let summary = result.summary;


  }
}
