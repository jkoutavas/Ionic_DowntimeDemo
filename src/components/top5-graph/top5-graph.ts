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
      let colors = [];
      for( let isScheduled of stats.isScheduled.slice(0,5) )
        colors.push(isScheduled==true?'#7cb5ec':"red");
      this.chart.series[0].update({colors:colors},true)
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
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        cursor: 'pointer',
        colorByPoint: true,
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
