import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { DiskQueryService } from "./disk-query.service";

@Component({
  selector: "path-input",
  templateUrl: "path-input.component.html",
  styleUrls: [
    "path-input.style.css"
  ]
})

export class PathInputComponent implements OnInit {
// TODO path completion
// TODO handle platform-specific paths ('\' vs '/', etc)

  iconToParentDir = require("./icons/ic_subdirectory_arrow_right_black_24px.svg");

  ngOnInit(): void {
    this.diskQueryService.diskQueryFinishedEvent.subscribe((result: any) => this.diskQueryFinishedHandler(result));
  }

  constructor(
    private diskQueryService: DiskQueryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  path = "";
  cwd: string;

  sendDiskUsageQuery(path: string): void {
    // TODO replace console.log with dev logging
    console.log(`Analyzing path: ${path}`);
    this.diskQueryService.diskUsage(path);
  }

  diskQueryFinishedHandler(result: any): void {
    this.cwd = result.summary.cwd;
    this.path = result.summary.cwd;
    this.changeDetectorRef.detectChanges();
  }

  toParentDir(): void {
    this.sendDiskUsageQuery(`${this.cwd}/..`);
  }
}
