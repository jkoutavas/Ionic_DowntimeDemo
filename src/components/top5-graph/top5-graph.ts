import { Component, Input } from '@angular/core';

/**
 * Generated class for the Top5GraphComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'top5-graph',
  templateUrl: 'top5-graph.html'
})
export class Top5GraphComponent {

  @Input() categories: String[];
  @Input() totals: Number[];

  private options: Object;
  
  ngOnInit() {
    this.options = { 
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Top Five Downtime Codes'
      },
      xAxis: {
        categories: this.categories,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'occurances',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' events'
      },
       credits: {
        enabled: false
      },
      series: [{
        name: "Downtime",
        data: this.totals
      }]
    }
  }
}
