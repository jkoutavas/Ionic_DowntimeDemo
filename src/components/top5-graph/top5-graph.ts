import { Component, Input, Output, EventEmitter } from '@angular/core';

import { DowntimeReasonsType } from '../../providers/downtime-data';

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
  
  @Input()
  set downtimeCodes(stats:DowntimeReasonsType) {
    if( this.chart ) {
      this.chart.xAxis[0].categories = stats.descriptions.slice(0,5);
      this.chart.series[0].setData(stats.totals.slice(0,5), true, true);
    }
  }

  @Output() clickCallback = new EventEmitter<any>();
  
  private options: Object;
  private chart: any = null;

  ngOnInit() {
    this.options = { 
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Top Five Downtime Reasons'
      },
      xAxis: {
        categories: [],
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
        cursor: 'pointer',
        name: "Downtime",
        data: []
      }]
    }
  }

  saveInstance(chartInstance: any) {
    if( this.chart == null ) {
      this.chart = chartInstance;
    }
  }

}
