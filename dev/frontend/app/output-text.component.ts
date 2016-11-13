import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import { DiskQueryService } from "./disk-query.service";
const STATUS = require("../../util/errorcodes.js").STATUS;

@Component({
  selector: "output-text",
  templateUrl: "output-text.component.html",
  styleUrls: [
    "output-text.style.css"
  ]
})

export class OutputTextComponent implements OnInit {

  entries: any[];
  summary: any;

  iconFolder = require("./icons/ic_folder_black_18px.svg");
  iconFile = require("./icons/ic_event_note_black_18px.svg");
  iconLt = require("./icons/ic_keyboard_arrow_left_black_18px.svg");
  iconGt = require("./icons/ic_keyboard_arrow_right_black_18px.svg");

  dirExists = false;
  querySubmitted = false;

  ngOnInit(): void {
    this.diskQueryService.diskQueryFinishedEvent.subscribe((result: any) => this.diskQueryFinishedHandler(result));
  }

  constructor(
    private diskQueryService: DiskQueryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  sendDiskUsageQuery(path: string): void {
    this.diskQueryService.diskUsage(path);
  }

  diskQueryFinishedHandler(result: any): void {
    this.querySubmitted = true;
    // TODO could be done using Observables? e.g. to solve situation where one can submit a long-time query then short
    // time query, short query results are displayed, then later the longer query results are displayed
    // View is not re-rendered until some UI action takes place
    // Possibly non-futureproof solution at http://stackoverflow.com/questions/34827334/triggering-angular2-change-detection-manually
    this.entries = result.entries;
    this.summary = result.summary;

    if (result.status === STATUS.OK) {
      this.dirExists = true;
      for (let i = 0; i < this.entries.length; i++) {
        let e = this.entries[i];
        e.relativeSize = e.fsize / this.summary.totalsize * 100;
      }
      this.changeDetectorRef.detectChanges();
    } else if (result.status === STATUS.DIR_NOT_EXIST) {
      this.dirExists = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  openFileView(path: string): void {
    // TODO handle user click on file
  }
}
