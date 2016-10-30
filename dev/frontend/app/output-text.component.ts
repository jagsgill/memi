import { Component, Input } from '@angular/core'

@Component({
  selector: "output-text",
  templateUrl: "output-text.component.html",
  styleUrls: [

  ]
})

export class OutputTextComponent {
  entries: string
  summary: string

  diskQueryFinished(result: any): void {
      // TODO could be done using Observables?
      this.entries = result.entries
      this.summary = result.summary
  }
}
