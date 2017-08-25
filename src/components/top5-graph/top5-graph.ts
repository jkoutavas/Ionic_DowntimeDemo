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
  
  @Input()
  set topDowntimeCodes(codes:[string[],number[]]) {
    if( this.chart ) {
      this.chart.xAxis[0].categories = codes[0];
      this.chart.series[0].setData(codes[1], true, true);
    }
  }
  
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
