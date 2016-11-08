import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { DiskQueryService } from './disk-query.service'


@Component({
  selector: "output-text",
  templateUrl: "output-text.component.html",
  styleUrls: [
    'output-text.style.css'
  ]
})

export class OutputTextComponent implements OnInit {

  entries: string[]
  summary: string
  iconFolder = require('./icons/ic_folder_black_18px.svg')
  iconFile = require('./icons/ic_event_note_black_18px.svg')

  ngOnInit(): void {
    this.diskQueryService.diskQueryFinishedEvent.subscribe((result:any) => this.diskQueryFinishedHandler(result))
  }

  constructor(
    private diskQueryService: DiskQueryService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  diskQueryFinishedHandler(result: any): void {
      // TODO could be done using Observables?
      // View is not re-rendered until some UI action takes place
      // Possibly non-futureproof solution at http://stackoverflow.com/questions/34827334/triggering-angular2-change-detection-manually
      this.entries = result.entries
      this.summary = result.summary
      this.changeDetectorRef.detectChanges()
  }
}
