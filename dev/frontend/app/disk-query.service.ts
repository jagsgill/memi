import { Injectable, OnInit } from '@angular/core'
import { ipcRenderer as ipc } from 'electron'

@Injectable()
export class DiskQueryService implements OnInit {
  ngOnInit(): void {

  }

  diskUsage(path: string): any {
    let result: any
    // set listener
    ipc.once('clientRequestDiskUsageCurrDir', (event, output, dir) => {
      // TODO inject correct logic depending on platform/command output
      // OR enforce an output format for this command for all platforms
      // i.e. simplify logic in either the backend or in the frontend
      let rawdata = output.split("\n")
      let entries_to_process = rawdata.slice(0, -3) // trim total line, 2x ""

      let entries = entries_to_process.map((e: string) => {
        let obj = {},
        data = e.split(/:/)
        obj['fname'] = data[1].toString()
        obj['fsize'] = data[0].toString()
        obj['type'] = data[2].toString()
        return obj
      })

      let summary = (() => {
        let data = rawdata[rawdata.length - 3].split(/:/),
        obj = {}
        obj['totalsize'] = data[0]
        obj['curr_dir'] = dir
        return obj
      })()
      console.log(entries)
      console.log(summary)
      result = {'entries': entries, 'summary': summary}
    })

    // submit query
    console.log(`sending path: ${path}`)
    ipc.send('clientRequestDiskUsageForPath', path)

    // return once async call completes
    // TODO ensure non-empty string is sent for queries that return no result
    // TODO use Promises/deferred?
    setTimeout( () => {
      if(result) return result
    }, 500)
  }
}
