import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import * as paths from "path";

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
    this.diskQueryService.diskUsage(paths.normalize(path));
  }

  diskQueryFinishedHandler(result: any): void {
    this.cwd = result.cwd;
    this.changeDetectorRef.detectChanges();
  }
}
