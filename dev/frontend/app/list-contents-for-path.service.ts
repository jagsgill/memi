import { Injectable, EventEmitter, Output } from "@angular/core";
import { ipcRenderer as ipc } from "electron";
import { Observable } from "rxjs";

import * as paths from "path";

const STATUS = require("../../util/errorcodes.js").STATUS;

@Injectable()
export class ListDirService {

    @Output() listDirFinishedEvent = new EventEmitter();
    resultStream: Observable<any>;
    channel = "requestListDirContents";

    constructor() {
        this.resultStream = Observable.fromEvent(
            ipc,
            this.channel,
            (event: any, output: any, dir: any) => {
                return this.parseListDirResults(output);
            }
        );
    }

    getResultStream(): Observable<any> {
        return this.resultStream;
    }

    listDirContents(path: string): void {
        console.log(`sending path for list dir contents: ${path}`);
        ipc.send(this.channel, paths.normalize(path));
    }

    parseListDirResults(output: any): string[] {
        let entries: string[];
        if (output.status === STATUS.OK) {
            entries = output.content.split("\n");
        } else if (output.status === STATUS.DIR_NOT_EXIST) {
            entries = ["Path does not exist."];
        }
        return entries;
    }
}
