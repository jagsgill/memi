import { Injectable, Output, EventEmitter } from "@angular/core";
import { ipcRenderer as ipc } from "electron";
import * as paths from "path";

const STATUS = require("../../util/errorcodes.js").STATUS;


@Injectable()
export class DiskQueryService {

  @Output() diskQueryFinishedEvent = new EventEmitter();

  constructor() {
    // http://onehungrymind.com/electron-angular-2-things/
    ipc.on("clientRequestDiskUsageForPath", this.sendParsedDiskUsageForPath.bind(this));
  }

  diskUsage(path: string): any {
    console.log(`sending path: ${path}`);
    ipc.send("clientRequestDiskUsageForPath", paths.normalize(path));
  }

  private sendParsedDiskUsageForPath(event: any, output: any, dir: any) {
    let rawdata = output.content.split("\n"),
    entries_to_process = rawdata.slice(0, -2), // trim the total line and 2x
    entries: any,
    summary: any;

    if (output.status === STATUS.OK) {
      entries = entries_to_process.map((e: string) => {
        let obj = {},
        data = e.split(/:/);
        obj["fname"] = data[1].toString();
        obj["fsize"] = data[0].toString();
        obj["type"] = data[2].toString();
        return obj;
      });

      summary = (() => {
        let data = rawdata[rawdata.length - 1].split(/:/),
        obj = {};
        obj["totalsize"] = data[0];
        obj["cwd"] = data[1]; // normalized path from system
        return obj;
      })();
    } else if (output.status === STATUS.DIR_NOT_EXIST) {
      entries = {};
      summary = { totalsize: "0", cwd: dir };
    }
    console.log(output.status);
    console.log(entries);
    console.log(summary);
    this.diskQueryFinishedEvent.emit(
      new DiskQueryResult(output.status, entries, summary)
    );
  }
}

export class DiskQueryResult {
  status: string;
  entries: any[];
  summary: any;

  constructor(status: string, entries: any[], summary: any) {
    this.status = status;
    this.entries = entries;
    this.summary = summary;
  }
}
