import * as d3 from 'd3'

export class OutputDetectiveChart {
  canvas: HTMLElement

  constructor(canvas: HTMLElement){
    this.canvas = canvas
  }

  render(files: any[]): void {
    let circleData = [
      { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
      { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }
    ]

    let text = d3.select(this.canvas)
    .selectAll("text")
    .data(circleData)
    .enter()
    .append("text")

    let textLabels = text
    .attr("x", function(d: any) { return d.cx; })
    .attr("y", function(d: any) { return d.cy; })
    .text( function (d: any) { return "( " + d.cx + ", " + d.cy +" )"; })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "red");
  }


}
